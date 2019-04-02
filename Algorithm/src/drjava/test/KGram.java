package drjava.test;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
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



    public static void main(String ... args) throws IOException {

        // FIRST TEST
        String[] firstPhrase = new String[]{
            "plagiarism",
            "instance",
            "using",
            "closely",
            "imitating",
            "language",
            "thoughts",
            "another",
            "author",
            "without",
            "authorization"
        };

        StringBuilder firstSB = new StringBuilder();
        for(String str : firstPhrase) firstSB.append(str);
        InputStream firstStream = new ByteArrayInputStream(firstSB.toString().getBytes(StandardCharsets.UTF_8));

        String[] secondPhrase = new String[] {
            "plagiarism",
            "copying",
            "ideas",
            "words",
            "another",
            "person" ,
            "without",
            "giving",
            "credit",
            "that",
            "person"
        };
        StringBuilder secondSB = new StringBuilder();
        for(String str : secondPhrase) secondSB.append(str);
        InputStream secondStream = new ByteArrayInputStream(secondSB.toString().getBytes(StandardCharsets.UTF_8));

        KGram kGram1, kGram2;

        kGram1 = KGram.Hash(firstStream, Algorithm.KARP_RABIN, 5, 10, 10007);
        kGram2 = KGram.Hash(secondStream, Algorithm.KARP_RABIN, 5, 10, 10007);

        Map map1 = kGram1.getHashMap();
        Map map2 = kGram2.getHashMap();

        int collisions = 0;
        for (Object key : map1.keySet()) {
            if (map2.containsKey(key)) {
                System.out.println("Collision -> " + key + "\t" + map1.get(key));
                collisions += 1;
            }
        }
        System.out.println("");
        System.out.println("Input 1:\t\t\t\""+firstSB.toString()+"\"");
        System.out.println("Input 2:\t\t\t\""+secondSB.toString()+"\"");
        double plagiarismRate = 2 * collisions;
        plagiarismRate /= map1.size() + map2.size();
        plagiarismRate *= 100;
        System.out.printf("%s%.2f%n", "Plagiarism Rate:\t", plagiarismRate);

        // SECOND TEST

        String phrase1 = "plagiarisminstanceusingcloselyimitatinglanguagethoughtsanotherauthorwithoutauthorization";
        String phrase2 = "plagiarismisanactofcopyingtheideasorwordsofanotherpersonwithoutgivingcredittothatperson";

        InputStream stream1 = new ByteArrayInputStream(phrase1.getBytes(StandardCharsets.UTF_8));
        InputStream stream2 = new ByteArrayInputStream(phrase2.getBytes(StandardCharsets.UTF_8));

        kGram1 = KGram.Hash(stream1, Algorithm.KARP_RABIN, 5, 10, 10007);
        System.out.println();
        kGram2 = KGram.Hash(stream2, Algorithm.KARP_RABIN, 5, 10, 10007);
        System.out.println();

        map1 = kGram1.getHashMap();
        map2 = kGram2.getHashMap();

        collisions = 0;
        for (Object key : map1.keySet()) {
            if (map2.containsKey(key)) {
                System.out.println("Collision -> " + key + "\t" + map1.get(key));
                collisions += 1;
            }
        }
        System.out.println("");
        System.out.println("Input 1:\t\t\t\""+phrase1+"\"");
        System.out.println("Input 2:\t\t\t\""+phrase2+"\"");
        plagiarismRate = 2 * collisions;
        plagiarismRate /= map1.size() + map2.size();
        plagiarismRate *= 100;
        System.out.printf("%s%.2f%n", "Plagiarism Rate:\t", plagiarismRate);


    }

}
