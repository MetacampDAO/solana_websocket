import { Connection, Commitment, PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

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

const ACCESS_LOCK_PROG_ID = new PublicKey(process.env.PROGRAM_ID);

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

  console.log("triggerAccount", triggerAccount.toString());
  // Subscribe to assets on blockchain changes

  console.log("Listening...");
  connectedCluster.onAccountChange(
    triggerAccount,
    async (triggerState: any) => {
      try {
        console.log(triggerState);
  
        // Check if it's triggerState.counter that changes
        console.log("State change, unlocking door");
        // Trigger door to unlock
        fetch(process.env.UNLOCK_ENDPOINT, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
          method: "POST",
        });
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'unknown error';
        console.log('Error:', errMessage)
      }
    }
  );
})();
