package mocd.antlr4.parser;

import mocd.antlr4.generated.java8.Java8Lexer;
import mocd.antlr4.generated.java8.Java8Parser;
import mocd.antlr4.listener.Java8PreProcessor;
import mocd.antlr4.listener.PreProcessor;
import mocd.io.SourceFile;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.ParseTreeWalker;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.io.IOException;
import java.util.ArrayList;

public class Java8FileParser implements FileParser {

    private final SourceFile file;
    private final Java8Lexer lexer;
    private final TokenStream tokens;
    private final Java8Parser parser;
    private final PreProcessor preProcessor;

    public Java8FileParser(SourceFile file) throws IOException {
        this.file = file;
        this.lexer = new Java8Lexer(CharStreams.fromFileName(file.getPath()));
        this.tokens = new CommonTokenStream(lexer);
        this.parser = new Java8Parser(tokens);
        this.preProcessor = new Java8PreProcessor();
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
        return this.parser.compilationUnit();
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
