package mocd.algorithm;

import mocd.io.SourceFile;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class Fingerprint {

    private final SourceFile sourceFile;
    private final List<KGram> fingerprint;
    private Map<Long, List<KGram>> kGramMap = null;

    public Fingerprint(SourceFile sourceFile, List<KGram> fingerprint) {
        this.sourceFile = sourceFile;
        this.fingerprint = fingerprint;
    }

    public SourceFile getSourceFile() {
        return sourceFile;
    }

    public List<KGram> getFingerprint() {
        return fingerprint;
    }

    public Map<Long, List<KGram>> getKGramMap() {
        if (kGramMap != null) return this.kGramMap;

        Map<Long, List<KGram>> hashMap = new HashMap<>();

        for (KGram kGram : getFingerprint()) {
            if (!hashMap.containsKey(kGram.getHash())) {
                hashMap.put(kGram.getHash(), new LinkedList<>());
            }
            hashMap.get(kGram.getHash()).add(kGram);
        }

        return kGramMap = hashMap;
    }

    @Override
    public String toString() {
        return fingerprint.toString();
    }

}
