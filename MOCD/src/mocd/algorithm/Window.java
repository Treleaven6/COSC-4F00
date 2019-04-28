package mocd.algorithm;

import org.antlr.v4.runtime.misc.Interval;

import java.util.ArrayList;
import java.util.List;

public class Window {

    private final List<KGram> window;
    private int lowestHash;

    public Window(KGram[] window) {
        this.window = new ArrayList<>(window.length);
        this.lowestHash = -1;

        for (int i=0; i<window.length; i++) {
            this.window.add(window[i]);


            if (lowestHash == -1 || window[i].getHash() <= window[lowestHash].getHash()) {
                this.lowestHash = i;
            }
        }
    }

    public List<KGram> getKGramList() {
        return this.window;
    }

    public KGram getLowestKGram() {
        return (lowestHash == -1) ? null : this.window.get(lowestHash);
    }

    public long getLowestHash() {
        return this.getLowestKGram().getHash();
    }

    public Interval getInterval() {
        return new Interval(window.get(0).getStart(), window.get(size()-1).getEnd());
    }

    public int size() {
        return this.window.size();
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i=0; i<size(); i++) {
            stringBuilder.append(window.get(i).getHash()+", ");
        }
        stringBuilder.delete(stringBuilder.length()-2, stringBuilder.length());
        return "["+lowestHash+"] {" + stringBuilder.toString() +'}';
    }
}
