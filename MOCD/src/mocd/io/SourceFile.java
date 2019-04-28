package mocd.io;

import mocd.antlr4.SupportedGrammar;

import java.io.File;
import java.net.URI;

public class SourceFile extends File {


    public SourceFile(String pathname) {
        super(pathname);
    }

    public SourceFile(String parent, String child) {
        super(parent, child);
    }

    public SourceFile(File parent, String child) {
        super(parent, child);
    }

    public SourceFile(URI uri) {
        super(uri);
    }

    public SupportedGrammar getGrammar() {
        return SupportedGrammar.fromFile(this);
    }

    @Override
    public String toString() {
        return this.getName();
    }

}
