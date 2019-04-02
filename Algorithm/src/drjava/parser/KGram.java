package drjava.parser;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class KGram {

    private final int gramLength;
    private final int base;
    private final int mod;
    private final Map<Integer, String> hashMap;

    // Constructor
    private KGram(int gramLength, int base, int mod, Map<Integer, String> hashMap) {
        this.gramLength = gramLength;
        this.base = base;
        this.mod = mod;
        this.hashMap = hashMap;
    }

    // Accessor Methods
    public int getGramLength() {
        return gramLength;
    }

    public int getBase() {
        return base;
    }

    public int getMod() {
        return mod;
    }

    public Map<Integer, String> getHashMap() {
        return hashMap;
    }

    // Hash Algorithms
    public static enum Algorithm {
        KARP_RABIN
    }

    public static KGram Hash(InputStream stream, Algorithm algorithm, int k, int base, int mod) throws IOException {

        switch (algorithm) {

            case KARP_RABIN:
            default:

                HashMap<Integer, String> hashMap = new HashMap<>();
                InputStreamReader reader = new InputStreamReader(stream);
                String substr = "";

                // populate substr
                for (int i=0; i<k; i++) {
                    substr += (char) reader.read();
                }

                long curHash = KarpRabinHash(substr, base, mod);
                hashMap.put((int) curHash, substr);
//                System.out.printf("%-4s\t%s%n", curHash, substr);

                char c;
                while(reader.ready()) {
                    substr = substr.substring(1) + ((char) reader.read());
                    curHash = KarpRabinHash(substr, base, mod);
                    hashMap.put((int) curHash, substr);
//                    System.out.printf("%-4s\t%s%n", curHash, substr);
                }

                return new KGram(k, base, mod, hashMap);

        }
    }

    public static long KarpRabinHash(String str, int base, int mod) {

        final int k = str.length();
        long hash = 0;

        for (int i=1; i<=k; i++) {
            hash += str.charAt(i-1) * Math.pow(base, k-i);
        }

        return hash % mod;
    }

}
