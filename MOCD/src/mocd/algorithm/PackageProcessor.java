package mocd.algorithm;

import mocd.io.SourceFile;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

public class PackageProcessor implements Runnable {

    private final File workDirectory;
    private final File result;
    private BufferedWriter writer;

    private final HashMap<File, List<Fingerprint>> submissions;
    private final HashMap<File, File> childToParent;
    private File currentParent;

    private final HashMap<Long, List<Fingerprint>> hashmapping;
    private final HashMap<Fingerprint, Fingerprint> fingerprintMatches;

    public PackageProcessor(File workDirectory) {
        this.workDirectory = workDirectory;
        this.result = new File(workDirectory, "result.txt");
        this.submissions = new HashMap<>();
        this.childToParent = new HashMap<>();
        this.hashmapping = new HashMap<>();
        this.fingerprintMatches = new HashMap<>();
    }

    @Override
    public void run() {

        mapFileTree();
        mapAllHashesToFingerprint();

        try {
            writer = new BufferedWriter(Files.newBufferedWriter(result.toPath()));
            processFiles();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public File getResults() {
        return result;
    }

    private void mapFileTree() {
        // Flattens root directories (src/ file structure is irrelevant)
        for (File file : workDirectory.listFiles()) {
            if (!file.isDirectory()) continue;
            currentParent = file;
            submissions.put(file, getDirFingerprints(file));
        }
    }

    private List<Fingerprint> getDirFingerprints(File dir) {

        List<Fingerprint> childrenFiles = new LinkedList<>();

        for (File file : dir.listFiles()) {
            if (file.isDirectory()) {
                childrenFiles.addAll(getDirFingerprints(file));
            } else {
                WinnowingAlgorithm algorithm = new WinnowingAlgorithm(50, 25, new SourceFile(file.getPath()));
                algorithm.run();
                childrenFiles.add(algorithm.getFingerprint());
                childToParent.put(file, currentParent);
            }
        }

        return childrenFiles;

    }

    private void mapAllHashesToFingerprint() {
        // Maps KGram Hashes to Fingerprints containing the Hash
        List<Fingerprint> fingerprints;
        for (File file : submissions.keySet()) {

            fingerprints = submissions.get(file);
            for (Fingerprint fingerprint : fingerprints) {
                for (KGram gram : fingerprint.getFingerprint()) {

                    if (hashmapping.containsKey(gram.getHash())) {
                        hashmapping.get(gram.getHash()).add(fingerprint);
                    } else {
                        List<Fingerprint> collection =new LinkedList<>();
                        collection.add(fingerprint);
                        hashmapping.put(gram.getHash(), collection);
                    }

                }
            }
        }
    }

    private void processFiles() throws IOException {
        // process file matches using fingerprints
        List<Fingerprint> matchList;
        for (File dir : submissions.keySet()) {

            writePackage(dir.getName());

            for (Fingerprint fingerprint : submissions.get(dir)) {

                writeFile(fingerprint.getSourceFile().getName());
                matchList = new LinkedList<>();

                for (KGram gram : fingerprint.getFingerprint()) {
                    for (Fingerprint aMatch : hashmapping.get(gram.getHash())) {

                        if (fingerprint.equals(aMatch)) continue;

                        if (!matchList.contains(aMatch)) {
                            matchList.add(aMatch);
                            writeComparisonFile(
                                    aMatch.getSourceFile().getParentFile().getName(),
                                    aMatch.getSourceFile().getName()
                            );
                            compareFingerprints(fingerprint, aMatch);
                        }
                    }
                }
            }
        }
    }

    private void compareFingerprints(Fingerprint fingerprintA, Fingerprint fingerprintB) throws IOException {

        Map<Long, List<KGram>> mapA = fingerprintA.getKGramMap();
        Map<Long, List<KGram>> mapB = fingerprintB.getKGramMap();
        Map<Long, String> lineNumbers = new HashMap<>();

        List<KGram> kGramListA;
        List<KGram> kGramListB;

        int i = 1;
        double matches = 0;
        StringBuilder stringBuilder;
        for (Long hash : mapA.keySet()) {
            if (!mapB.containsKey(hash)) continue;

            kGramListA = mapA.get(hash);
            kGramListB = mapB.get(hash);

            stringBuilder = new StringBuilder();
            stringBuilder
                    .append(getLineNumberString(kGramListA))
                    .append(" ")
                    .append(getLineNumberString(kGramListB));

            lineNumbers.put(hash, stringBuilder.toString());

            matches += kGramListA.size() + kGramListB.size();

        }

        writeGrade(matches / (fingerprintA.getFingerprint().size() + fingerprintB.getFingerprint().size()) * 100);
        writeLineMatches(lineNumbers.values());
    }

    private String getLineNumberString(List<KGram> kGramList) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("[");
        for (KGram kGram : kGramList) {
            stringBuilder
                    .append(kGram.getStart())
                    .append("-")
                    .append(kGram.getEnd())
                    .append(", ");
        }

        stringBuilder.deleteCharAt(stringBuilder.length()-1);
        stringBuilder.deleteCharAt(stringBuilder.length()-1);
        stringBuilder.append("]");

        return stringBuilder.toString();
    }

    private void writePackage(String packageName) throws IOException {
        writer.write(packageName);
        writer.newLine();
    }

    private void writeFile(String fileName) throws IOException {
        writer.write(String.format("\t%s%n", fileName));
    }

    private void writeComparisonFile(String packageName, String comparisonName) throws IOException {
        writer.write(String.format("\t\t[%s] %s%n", packageName, comparisonName));
    }

    private void writeGrade(double grade) throws IOException {
        writer.write(String.format("\t\t\tgrade: %.2f%%%n", grade));
    }

    private void writeLineMatches(Collection<String> lineMatches) throws IOException {
        ArrayList<String> lineMatchArr = new ArrayList<>(lineMatches);
        for (int i=0; i<lineMatchArr.size(); i++) {
            writer.write(String.format("\t\t\t[%4d]: %s%n", i, lineMatchArr.get(i)));
        }
        writer.newLine();
    }

}
