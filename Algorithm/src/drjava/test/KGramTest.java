package drjava.test;

import drjava.parser.KGram;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class KGramTest {

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

        kGram1 = KGram.Hash(firstStream, KGram.Algorithm.KARP_RABIN, 5, 10, 10007);
        kGram2 = KGram.Hash(secondStream, KGram.Algorithm.KARP_RABIN, 5, 10, 10007);

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

        kGram1 = KGram.Hash(stream1, KGram.Algorithm.KARP_RABIN, 5, 10, 10007);
        System.out.println();
        kGram2 = KGram.Hash(stream2, KGram.Algorithm.KARP_RABIN, 5, 10, 10007);
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
