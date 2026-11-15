package com.massivemarketmanager.backend.encryption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class CryptoService {
    private static final String TRANS = "AES/GCM/NoPadding";
    private static final int TAG_BITS = 128;
    private static final int IV_LEN = 12;

    @Value("${APP_MASTER_KEY_B64}")
    private String masterKeyB64;

    private byte[] masterKey;
    private final SecureRandom rng = new SecureRandom();

    @PostConstruct
    void init() {
        byte[] key = Base64.getDecoder().decode(masterKeyB64);
        if (key.length != 32) throw new IllegalStateException("APP_MASTER_KEY_B64 must be 32 bytes");
        this.masterKey = key;
    }

    public String encryptHexPrivKey(String hex64) {
        byte[] pk = fromHex64(hex64);
        byte[] iv = new byte[IV_LEN];
        rng.nextBytes(iv);
        try {
            Cipher c = Cipher.getInstance(TRANS);
            c.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(masterKey, "AES"), new GCMParameterSpec(TAG_BITS, iv));
            byte[] ct = c.doFinal(pk);
            byte[] blob = new byte[iv.length + ct.length];
            System.arraycopy(iv, 0, blob, 0, iv.length);
            System.arraycopy(ct, 0, blob, iv.length, ct.length);
            return Base64.getEncoder().encodeToString(blob);
        } catch (Exception e) {
            throw new IllegalStateException("encrypt failed", e);
        }
    }

    public String decryptToHexPrivKey(String b64) {
        byte[] blob = Base64.getDecoder().decode(b64);
        if (blob.length < IV_LEN + 16) throw new IllegalArgumentException("blob too short");
        byte[] iv = new byte[IV_LEN];
        byte[] ct = new byte[blob.length - IV_LEN];
        System.arraycopy(blob, 0, iv, 0, IV_LEN);
        System.arraycopy(blob, IV_LEN, ct, 0, ct.length);
        try {
            Cipher c = Cipher.getInstance(TRANS);
            c.init(Cipher.DECRYPT_MODE, new SecretKeySpec(masterKey, "AES"), new GCMParameterSpec(TAG_BITS, iv));
            byte[] pk = c.doFinal(ct);
            return "0x" + toHex(pk);
        } catch (Exception e) {
            throw new IllegalStateException("decrypt failed", e);
        }
    }

    private static byte[] fromHex64(String s) {
        String x = (s.startsWith("0x") || s.startsWith("0X")) ? s.substring(2) : s;
        if (x.length() != 64) throw new IllegalArgumentException("private key must be 64 hex chars");
        byte[] out = new byte[32];
        for (int i = 0; i < 32; i++) {
            int hi = Character.digit(x.charAt(i*2), 16);
            int lo = Character.digit(x.charAt(i*2+1), 16);
            if (hi < 0 || lo < 0) throw new IllegalArgumentException("non-hex char");
            out[i] = (byte)((hi<<4) + lo);
        }
        return out;
    }
    private static String toHex(byte[] b) {
        char[] hex = new char[b.length*2];
        char[] d = "0123456789abcdef".toCharArray();
        for (int i = 0; i < b.length; i++) { int v = b[i] & 0xFF; hex[i*2]=d[v>>>4]; hex[i*2+1]=d[v&15]; }
        return new String(hex);
    }
}

