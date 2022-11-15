import * as anchor from "@project-serum/anchor";
import dotenv from "dotenv";
import { PublicKey, Connection, Keypair, Commitment } from "@solana/web3.js";
import { Idl, AnchorProvider } from "@project-serum/anchor";
import * as metacamp_access_lock from "./idl/metacamp_access_lock";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { MetacampAccessLock } from "./idl/metacamp_access_lock";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

dotenv.config();

const options = {
  commitment: "processed" as Commitment,
};
export const conn: Connection = new Connection(process.env.NETWORK, options);
const ACCESS_LOCK_PROG_ID = new PublicKey(process.env.ACCESS_LOCK_PROGRAM_ID);

const walletFromSecret = (str: string) => {
  const passDecodeKp = bs58.decode(str);
  const passU8IntKp = new Uint8Array(
    passDecodeKp.buffer,
    passDecodeKp.byteOffset,
    passDecodeKp.byteLength / Uint8Array.BYTES_PER_ELEMENT
  );
  const passWallet = Keypair.fromSecretKey(passU8IntKp);
  return passWallet;
};

export async function initAccessLockClient() {
  const passWallet = walletFromSecret(process.env.PASS_SECRET);
  const lockWallet = walletFromSecret(process.env.LOCK_SECRET);
  const [triggerAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("trigger")),
      lockWallet.publicKey.toBuffer(),
    ],
    ACCESS_LOCK_PROG_ID
  );

  return new LockClient(
    conn,
    passWallet,
    lockWallet,
    triggerAccount,
    metacamp_access_lock as any,
    ACCESS_LOCK_PROG_ID
  );
}

export class LockClient {
  conn: Connection;
  passWallet: Keypair;
  lockWallet: Keypair | undefined;
  triggerAccount: PublicKey;
  provider!: anchor.Provider;
  accessLockProgram!: anchor.Program<MetacampAccessLock>;

  constructor(
    conn: Connection,
    passWallet: Keypair,
    lockWallet: Keypair | undefined,
    triggerAccount: PublicKey,
    idl?: Idl,
    programId?: PublicKey
  ) {
    this.conn = conn;
    this.passWallet = passWallet;
    this.lockWallet = lockWallet;
    this.triggerAccount = triggerAccount;
    this.setProvider();
    this.setAccessLockProgram(idl, programId);
  }

  setProvider() {
    this.provider = new AnchorProvider(
      this.conn,
      new NodeWallet(this.passWallet),
      AnchorProvider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setAccessLockProgram(idl?: Idl, programId?: PublicKey) {
    //instantiating program depends on the environment
    if (idl && programId) {
      //means running in prod
      this.accessLockProgram = new anchor.Program<MetacampAccessLock>(
        idl as any,
        programId,
        this.provider
      );
    }
  }

  // --------------------------------------- fetch trigger account state

  fetchTriggerState = async () => {
    return this.accessLockProgram.account.trigger.fetch(this.triggerAccount);
  };
}
