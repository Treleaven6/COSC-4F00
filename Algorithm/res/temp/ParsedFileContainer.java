package temp;

import temp.io.SourceFile;
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.Parser;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

public class ParsedFileContainer {

    private final SourceFile file;
    private final Lexer lexer;
    private final TokenStream tokens;
    private final Parser parser;
    private final ParseTree parseTree;
    private final SyntaxTree syntaxTree;

    public ParsedFileContainer(SourceFile file, Lexer lexer, TokenStream tokens, Parser parser, ParseTree parseTree, SyntaxTree syntaxTree) {
        this.file = file;
        this.lexer = lexer;
        this.tokens = tokens;
        this.parser = parser;
        this.parseTree = parseTree;
        this.syntaxTree = syntaxTree;
    }

    public SourceFile getFile() {
        return file;
    }

    public Lexer getLexer() {
        return lexer;
    }

    public TokenStream getTokens() {
        return tokens;
    }

    public Parser getParser() {
        return parser;
    }

    public ParseTree getParseTree() {
        return parseTree;
    }

    public SyntaxTree getSyntaxTree() {
        return syntaxTree;
    }
}
