package mocd.antlr4.parser;

import mocd.antlr4.generated.c.CLexer;
import mocd.antlr4.generated.c.CParser;
import mocd.antlr4.listener.C11PreProcessor;
import mocd.antlr4.listener.PreProcessor;
import mocd.io.SourceFile;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.ParseTreeWalker;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class C11FileParser implements FileParser {

    private final SourceFile file;
    private final CLexer lexer;
    private final TokenStream tokens;
    private final CParser parser;
    private final C11PreProcessor preProcessor;

    public C11FileParser(SourceFile file) throws IOException {
        this.file = file;

        final boolean[] ignoreLine = new boolean[1];

        Stream<String> lines = Files.lines(file.toPath());
        List<String> replaced = lines.map(
                line -> {

                    if (line.startsWith("#ifdef") || line.startsWith("#ifndef") || line.startsWith("#if")) {
                        ignoreLine[0] = true;
                    } else if (line.startsWith("#endif")) {
                        ignoreLine[0] = false;
                    }

                    if (ignoreLine[0]) return "";

                    return line
                            .replaceAll("^#.*", "")
                            .replaceAll("&([\\w])", "$1");
                }
        ).collect(Collectors.toList());
        Files.write(file.toPath(), replaced);
        lines.close();

        this.lexer = new CLexer(CharStreams.fromFileName(file.getPath()));
        this.tokens = new CommonTokenStream(lexer);
        this.parser = new CParser(tokens);
        this.preProcessor = new C11PreProcessor();
}

    @Override
    public void process() {
        ParseTreeWalker waler = new ParseTreeWalker();
        waler.walk(preProcessor, getParseTree());
    }

    @Override
    public SourceFile getSourceFile() {
        return this.file;
    }

    @Override
    public Lexer getLexer() {
        return this.lexer;
    }

    @Override
    public TokenStream getTokenStream() {
        return this.tokens;
    }

    @Override
    public Parser getParser() {
        return this.parser;
    }

    @Override
    public ParseTree getParseTree() {
        return this.parser.translationUnit();
    }

    @Override
    public PreProcessor getPreProcessor() {
        return this.preProcessor;
    }

    @Override
    public ArrayList<TerminalNode> getProcessedNodes() {
        return this.preProcessor.getNodeList();
    }
}
