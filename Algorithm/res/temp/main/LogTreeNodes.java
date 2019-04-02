package temp.main;

import temp.io.FileParser;
import org.antlr.v4.runtime.tree.ParseTree;

// TODO - Handle errers ->
//      What if a grammar is not explicitly stated?
//          - use file extension to match with grammer, else throw GrammarNotFoundException
//      What if a grammar is not supported?
//           - throw GrammarNotFoundException
//
//      Create Error:
//          1 -> GrammarNotFoundException
//
//

public class LogTreeNodes {

    public static final int GRAMMAR_NOT_FOUND_EXCEPTION = 1;

    private FileParser fileParser;

    public LogTreeNodes(String path) {

        fileParser = new FileParser(path);



//        TreeFrame frame = new TreeFrame(
//                fileParser.getGrammar().toString(),
//                fileParser.getParser().getRuleNames(),
//                fileParser.getParseTree()
//        );
//
//        frame.launch(fileParser.getFile().getFile().getName());


//        SyntaxTree ast = SyntaxTree.Build(fileParser.getParseTree());
//        TreeFrame frame2 = new TreeFrame(
//                fileParser.getGrammar().toString(),
//                fileParser.getParser().getRuleNames(),
//                ast
//        );
//
//        frame2.launch(fileParser.getFile().getFile().getName());

        traverseTree(fileParser.getParseTree());
    }

    public void traverseTree(ParseTree tree, int depth) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i=0; i<depth; i++) {
            stringBuilder.append("\t");
        }

        stringBuilder.append(depth);
        while(stringBuilder.length() < 4) {
            stringBuilder.insert(0, " ");
        }

        stringBuilder.append(" - " + tree.getText());
        System.out.println(stringBuilder);

        int childCount = tree.getChildCount();
        ParseTree parent = tree.getParent();

        for (int i=0; i<childCount; i++) {
            traverseTree(tree.getChild(i), depth+1);
        }
    }

    public void traverseTree(ParseTree tree) {
        traverseTree(tree, 0);
    }

    public static void main (String ... args) {

        String[] paths = new String[] {
                "res/Source1/topo_sort.cpp",
                "res/Source1/topo_sort2.cpp",
                "res/Source1/u_topo_sort.cpp"
        };

        for (String path : paths) {
            new LogTreeNodes(path);
        }
    }

}
