import { Connection, Commitment, PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { initAccessLockClient } from "./src/program";
import { MetacampAccessLock } from "./src/idl/metacamp_access_lock";

require("dotenv").config({ path: ".env" });

const walletFromSecret = (str: string) => {
  console.log(str);
  const passDecodeKp = bs58.decode(str);
  const passU8IntKp = new Uint8Array(
    passDecodeKp.buffer,
    passDecodeKp.byteOffset,
    passDecodeKp.byteLength / Uint8Array.BYTES_PER_ELEMENT
  );
  const passWallet = Keypair.fromSecretKey(passU8IntKp);
  return passWallet;
};

const getTriggerPda = async (lockPubkey: PublicKey, programId: PublicKey) => {
  const [triggerAccount, _triggerBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("trigger")),
      lockPubkey.toBuffer(),
    ],
    programId
  );

  return triggerAccount;
};
const ACCESS_LOCK_PROG_ID = new PublicKey(process.env.ACCESS_LOCK_PROGRAM_ID);

(async () => {
  const options = {
    commitment: "processed" as Commitment,
    wsEndpoint: process.env.WS_ENDPOINT,
  };
  const connectedCluster = new Connection(process.env.NETWORK, options);

  const lockWallet = walletFromSecret(process.env.LOCK_SECRET);
  const triggerAccount = await getTriggerPda(
    lockWallet.publicKey,
    ACCESS_LOCK_PROG_ID
  );
  const lockClient = await initAccessLockClient();
  const encodedTrigger = await connectedCluster.getAccountInfo(triggerAccount);
  const decodedTrigger = lockClient.accessLockProgram.coder.accounts.decodeUnchecked<
    anchor.IdlAccounts<MetacampAccessLock>["trigger"]
  >("Trigger", encodedTrigger.data);
  let counter: number = decodedTrigger.count;

  console.log("triggerAccount", triggerAccount.toString());
  // Subscribe to assets on blockchain changes

  console.log("Listening...");
  connectedCluster.onAccountChange(
    triggerAccount,
    async (triggerState: any) => {
      console.log("triggerState", triggerState);

      try {
        console.log("State change, unlocking door");
        const deserializedTrigger = lockClient.accessLockProgram.coder.accounts.decodeUnchecked<
          anchor.IdlAccounts<MetacampAccessLock>["trigger"]
        >("Trigger", triggerState.data);
        if (deserializedTrigger.count <= counter) {
          throw Error("Counter did not increase")
        }
        counter = deserializedTrigger.count;

        // Trigger door to unlock
        fetch(process.env.UNLOCK_ENDPOINT, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
          method: "POST",
        });

        // Check if it's triggerState.counter that changes
        // LOOKUP MINT IN MEMBERSHIIP_NFTS
        const prisma = new PrismaClient();
        const membershipNftDb = await prisma.membership_nfts.findUnique({
          where: { mint: deserializedTrigger.latestMint.toString() },
        });

        // // CREATE ENTRIES WITH MEMBERSHIP_NFT_ID & MINT ADDRESS
        await prisma.entries.create({
          data: {
            mint: membershipNftDb.mint,
            membership_nft_id: membershipNftDb.id,
          },
        });
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : "unknown error";
        console.log("Error:", errMessage);
      }
    }
  );
})();
