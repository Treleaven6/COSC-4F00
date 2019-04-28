package mocd.algorithm;


import org.antlr.v4.runtime.misc.Interval;

public class KGram {

    private final String target;
    private final int start;
    private final int end;
    private long hash;

    private static final int BASE = 2;

    public KGram(String target, int start, int end) {
        this.target = target;
        this.start = start;
        this.end = end;
    }

    public String getTarget() {
        return target;
    }

    public int getStart() {
        return start;
    }

    public int getEnd() {
        return end;
    }

    public Interval getInterval() {
        return new Interval(getStart(), getEnd());
    }

    public long getHash() {
        return hash;
    }

    public long hash() {
        // Hash Function H(c1, ..., ck) = c1 * base^k-1 + c2 * base^k-2 + ... + ck
        this.hash = 0;
        char[] chars = target.toCharArray();
        for (int i=0; i<chars.length; i++) {
            hash += chars[i]*Math.pow(BASE, chars.length-1-i);
        }

        return hash;
    }

    public long hash(long prevHash, char oldChar) {
        // Rolling Hash Function -> H(c2, ..., ck+1) = (H(c1, ..., ck) - (c1 * b^k-1)) * base + ck+1
        return this.hash = (prevHash - (oldChar * (long) Math.pow(BASE, target.length()-1))) * BASE + target.charAt(target.length()-1);
    }

    public int length() {
        return target.length();
    }

    @Override
    public String toString() {
        return hash +"";
    }

}
