/**
 * Genuine Web Crypto API SHA-256 Implementation (Browser)
 * Replaces any simulated or Math.random() hashes with cryptographic SHA-256.
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

export async function computeBrowserSha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export interface ClientAuditBlock {
  blockHeight: number;
  previousHash: string;
  blockHash: string;
  recordType: string;
  recordId: string;
  payload: any;
  timestamp: string;
  author: string;
  status: 'VERIFIED' | 'TAMPERED';
}

export async function verifyClientLedgerChain(blocks: ClientAuditBlock[]): Promise<{
  isValid: boolean;
  totalChecked: number;
  validCount: number;
  tamperedCount: number;
  seal: string;
}> {
  let validCount = 0;
  let tamperedCount = 0;
  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const prevMatches = (i === 0) || (b.previousHash === expectedPrevHash);

    const canonicalPayload = canonicalJsonStringify(b.payload);
    const content = `${b.previousHash}|${b.recordType}|${b.recordId}|${canonicalPayload}|${b.timestamp}|${b.author}`;
    const calculatedHash = await computeBrowserSha256(content);

    if (prevMatches && calculatedHash === b.blockHash) {
      validCount++;
      expectedPrevHash = b.blockHash;
    } else {
      tamperedCount++;
      expectedPrevHash = b.blockHash;
    }
  }

  const latestHash = blocks[blocks.length - 1]?.blockHash || '';
  const seal = await computeBrowserSha256(`CLIENT_VERIFIED|${validCount}|${latestHash}`);

  return {
    isValid: tamperedCount === 0 && blocks.length > 0,
    totalChecked: blocks.length,
    validCount,
    tamperedCount,
    seal
  };
}
