package mocd.antlr4.parser;

import mocd.antlr4.generated.cpp.CPP14Lexer;
import mocd.antlr4.generated.cpp.CPP14Parser;
import mocd.antlr4.listener.CPP14PreProcessor;
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

public class CPP14FileParser implements FileParser {

    private final SourceFile file;
    private final CPP14Lexer lexer;
    private final TokenStream tokens;
    private final CPP14Parser parser;
    private final CPP14PreProcessor preProcessor;

    public CPP14FileParser(SourceFile file) throws IOException {
        this.file = file;

        final boolean[] ignoreLine = new boolean[1];

        Stream<String> lines = Files.lines(file.toPath());
        List<String> replaced = lines.map(
                line -> {
                    return line;
                }
        ).collect(Collectors.toList());
        Files.write(file.toPath(), replaced);
        lines.close();



        this.lexer = new CPP14Lexer(CharStreams.fromFileName(file.getPath()));
        this.tokens = new CommonTokenStream(lexer);
        this.parser = new CPP14Parser(tokens);
        this.preProcessor = new CPP14PreProcessor();
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
        return this.parser.translationunit();
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
