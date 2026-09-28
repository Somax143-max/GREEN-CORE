import crypto from 'crypto';
import { db } from '../db/database.js';

export interface AuditBlock {
  block_height: number;
  previous_hash: string;
  block_hash: string;
  record_type: string;
  record_id: string;
  payload_json: string;
  timestamp: string;
  author: string;
}

export interface LedgerVerificationReport {
  isValid: boolean;
  totalBlocksChecked: number;
  validBlocksCount: number;
  tamperedBlocksCount: number;
  genesisHash: string;
  latestBlockHash: string;
  verificationTimestamp: string;
  auditSeal: string;
  tamperedBlockDetails: Array<{
    blockHeight: number;
    expectedHash: string;
    actualHash: string;
  }>;
}

/**
 * Deterministically serialize an object to canonical JSON string
 * with sorted keys for consistent SHA-256 hashing.
 */
export function canonicalJsonStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalJsonStringify).join(',')}]`;
  }
  const keys = Object.keys(obj).sort();
  const keyValues = keys.map(k => `${JSON.stringify(k)}:${canonicalJsonStringify(obj[k])}`);
  return `{${keyValues.join(',')}}`;
}

export function computeSha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function computeBlockHash(
  previousHash: string,
  recordType: string,
  recordId: string,
  payloadJson: string,
  timestamp: string,
  author: string
): string {
  const blockContent = `${previousHash}|${recordType}|${recordId}|${payloadJson}|${timestamp}|${author}`;
  return computeSha256(blockContent);
}

/**
 * Append a verified record to the cryptographic SQLite ledger
 */
export function appendToAuditLedger(
  recordType: string,
  recordId: string,
  payload: any,
  author: string
): AuditBlock {
  const lastBlock = db.prepare('SELECT block_hash FROM audit_ledger ORDER BY block_height DESC LIMIT 1').get() as { block_hash: string } | undefined;
  const previousHash = lastBlock?.block_hash || '0000000000000000000000000000000000000000000000000000000000000000';

  const payloadJson = canonicalJsonStringify(payload);
  const timestamp = new Date().toISOString();
  const blockHash = computeBlockHash(previousHash, recordType, recordId, payloadJson, timestamp, author);

  const stmt = db.prepare(`
    INSERT INTO audit_ledger (previous_hash, block_hash, record_type, record_id, payload_json, timestamp, author)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(previousHash, blockHash, recordType, recordId, payloadJson, timestamp, author);

  return {
    block_height: Number(info.lastInsertRowid),
    previous_hash: previousHash,
    block_hash: blockHash,
    record_type: recordType,
    record_id: recordId,
    payload_json: payloadJson,
    timestamp,
    author
  };
}

/**
 * Genuine Cryptographic Ledger Verification
 * Recalculates every SHA-256 hash in the chain from Block #1 to Block #N.
 */
export function verifyAllLedgerBlocks(): LedgerVerificationReport {
  const blocks = db.prepare('SELECT * FROM audit_ledger ORDER BY block_height ASC').all() as AuditBlock[];
  
  let validBlocksCount = 0;
  let tamperedBlocksCount = 0;
  const tamperedBlockDetails: Array<{ blockHeight: number; expectedHash: string; actualHash: string }> = [];

  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    // Check 1: Previous hash link
    const prevMatches = (i === 0) || (b.previous_hash === expectedPrevHash);

    // Check 2: Recompute cryptographic block hash
    const recomputedHash = computeBlockHash(
      b.previous_hash,
      b.record_type,
      b.record_id,
      b.payload_json,
      b.timestamp,
      b.author
    );

    const hashMatches = recomputedHash === b.block_hash;

    if (prevMatches && hashMatches) {
      validBlocksCount++;
      expectedPrevHash = b.block_hash;
    } else {
      tamperedBlocksCount++;
      tamperedBlockDetails.push({
        blockHeight: b.block_height,
        expectedHash: recomputedHash,
        actualHash: b.block_hash
      });
      expectedPrevHash = b.block_hash; // continue testing
    }
  }

  const isValid = tamperedBlocksCount === 0 && blocks.length > 0;
  const latestBlockHash = blocks[blocks.length - 1]?.block_hash || '';
  const genesisHash = blocks[0]?.block_hash || '';

  const auditSeal = computeSha256(`AUDIT_VERIFIED|${validBlocksCount}|${latestBlockHash}`);

  return {
    isValid,
    totalBlocksChecked: blocks.length,
    validBlocksCount,
    tamperedBlocksCount,
    genesisHash,
    latestBlockHash,
    verificationTimestamp: new Date().toISOString(),
    auditSeal,
    tamperedBlockDetails
  };
}
