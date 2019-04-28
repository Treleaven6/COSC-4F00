package mocd.algorithm;

import mocd.antlr4.parser.FileParser;
import mocd.io.SourceFile;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class WinnowingAlgorithm implements Runnable {

    private final int kGramLength;
    private final int windowLength;
    private final SourceFile sourceFile;

    private final List<KGram> kGramList;
    private final List<Window> windowList;

    private Fingerprint fingerprint;

    public WinnowingAlgorithm(int kGramLength, int windowLength, SourceFile sourceFile) {
        this.kGramLength = kGramLength;
        this.windowLength = windowLength;
        this.sourceFile = sourceFile;
        this.kGramList = new LinkedList<>();
        this.windowList = new LinkedList<>();
    }

    @Override
    public void run() {

        List<TerminalNode> nodeList;
        try {
            FileParser fileParser = FileParser.Parse(sourceFile);
            fileParser.process();
            nodeList = fileParser.getProcessedNodes();
        } catch (IOException e) {
            e.printStackTrace();
            // TODO - Handle un-processable file
            return;
        }

        // TODO - Check if nodeList is empty


        int kGramPos = 0;
        int windowPos = 0;
        long lastHash = -1;
        char lastChar = '\u0000';

        TerminalNode node;
        KGram kGram;
        KGram[] kGramArr;
        Window window;

        StringBuilder currentStringScope = new StringBuilder();
        LinkedList<TerminalNode> currentNodeScope = new LinkedList<>();
        List<KGram> aFingerprint = new LinkedList<>();

        for (int i=0; i<nodeList.size(); i++) {

            currentStringScope.append(nodeList.get(i));
            currentNodeScope.addLast(nodeList.get(i));

            // Generate KGrams
            while (kGramLength <= currentStringScope.length()) {
                kGram = new KGram(
                        currentStringScope.substring(0, kGramLength),           // Substring
                        currentNodeScope.getFirst().getSymbol().getLine(),      // Starting line
                        currentNodeScope.getLast().getSymbol().getLine()        // Ending line
                );

                lastHash = (lastHash == -1) ? kGram.hash() : kGram.hash(lastHash, lastChar);     // track last hash
                lastChar = currentStringScope.charAt(0);                                            // track last char
                currentStringScope.deleteCharAt(0);
                kGramPos++;

                if (currentNodeScope.getFirst().getText().length() <= kGramPos) {
                    currentNodeScope.removeFirst();
                    kGramPos = 0;
                }

                kGramList.add(kGram);

            }

            // Generate Windows
            while (0 <= kGramList.size()-windowLength-windowPos)
                if (windowLength <= kGramList.size() - windowPos) {

                    kGramArr = new KGram[windowLength];

                    for (int j=windowPos; j-windowPos<windowLength; j++) {
                        kGramArr[j-windowPos] = kGramList.get(j);
                    }

                    window = new Window(kGramArr);

                    // Checks if KGram has already been selected by adjacent window
                    if (windowList.size() == 0 || !windowList.get(windowList.size()-1).getLowestKGram().equals(window.getLowestKGram())) {
                        aFingerprint.add(window.getLowestKGram());
                    }

                    windowList.add(window);
                    windowPos++;

            }
        }

        this.fingerprint = new Fingerprint(sourceFile, aFingerprint);

    }

    public int getKGramLength() {
        return kGramLength;
    }

    public int getWindowLength() {
        return windowLength;
    }

    public SourceFile getSourceFile() {
        return sourceFile;
    }

    public List<KGram> getKGramList() {
        return kGramList;
    }

    public List<Window> getWindowList() {
        return windowList;
    }

    public Fingerprint getFingerprint() {
        return fingerprint;
    }
}
