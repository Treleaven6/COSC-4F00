package temp.io;

import temp.Grammar;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;

import java.io.File;
import java.io.IOException;

public class SourceFile {

    private final File file;
    private final Grammar grammar;

    public SourceFile(File file, Grammar grammar) {
        this.file = file;
        this.grammar = grammar;
    }

    public SourceFile(File file) {
        this(file, Grammar.getGrammarFromPath(file.getPath()));
    }

    public SourceFile(String path, Grammar grammar) {
        this(new File(path), grammar);
    }

    public SourceFile(String path) {
        this(path, Grammar.getGrammarFromPath(path));
    }

    public File getFile() {
        return this.file;
    }

    public Grammar getGrammar() {
        return this.grammar;
    }

    public CharStream getCharStream() throws IOException {
        return CharStreams.fromPath(this.file.toPath());
    }

}
