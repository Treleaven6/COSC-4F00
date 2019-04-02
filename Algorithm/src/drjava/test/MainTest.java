package drjava.test;

import drjava.antlr4.java8.Java8Listener;
import drjava.gui.DisplayTree;
import drjava.parser.FileParser;
import drjava.parser.Grammar;
import drjava.tree.TreeNode;
import drjava.tree.TreeWriter;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.ParseTreeWalker;
import org.antlr.v4.runtime.tree.Tree;

import java.io.File;
import java.io.IOException;

public class MainTest {

    public static void main(String ... args) {

        File file = new File("res/BusRoute.java");
        FileParser fileParser = new FileParser(file);

        try {
            ParseTree parseTree = fileParser.getParseTree();
            Tree tree = traverseTree(parseTree, null);

            TreeWriter writer = new TreeWriter("temp.java", tree);
            writer.save();
            new DisplayTree(file.getName(), Grammar.fromFile(file), tree);

            ParseTreeWalker walker = new ParseTreeWalker();
            Java8Listener listener = new Java8TestListener();
            walker.walk(listener, fileParser.getParseTree());

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static TreeNode traverseTree(ParseTree parseTree, TreeNode parent) {

        TreeNode node;
        String ctx = parseTree.getClass().getSimpleName();
        int childCount = parseTree.getChildCount();

        if (parent == null) {                                                                       // Root Node
            node = new TreeNode(parseTree, null, ctx);
            for (int i = 0; i < childCount; i++) {
                traverseTree(parseTree.getChild(i), node);
            }

            return node;
        } else if (childCount == 1 && parseTree.getChild(0).getChildCount() == 1) {  // Flattens Tree
            return traverseTree(parseTree.getChild(0), parent);

        } else if (childCount > 1 && (                                              // Cleanup variables
                ctx.equalsIgnoreCase("TypeNameContext") ||
                ctx.equalsIgnoreCase("FieldAccessContext") ||
                ctx.equalsIgnoreCase("ExpressionNameContext") ||
                ctx.equalsIgnoreCase("PrimaryContext")
        )) {
            node = new TreeNode(parseTree, parent, "V");

        } else if (                                                                                 // Cleanup Methods
                ctx.equalsIgnoreCase("MethodDeclaratorContext") ||
                ctx.equalsIgnoreCase("MethodInvocationContext") ||
                ctx.equalsIgnoreCase("MethodInvocation_lf_primary") ||
                ctx.equalsIgnoreCase("MethodInvocation_lfno_primaryContext")
        ) {
            node = new TreeNode(parseTree, parent, "MethodInvocation_lfno_primaryContext");


            for (int i = 0; i < childCount; i++) {
                if ((i == 0 && 3 <= childCount && childCount <= 4) || (i == 2 && 5 <= childCount && childCount <= 6)) {
                    node.getChildren().add(new TreeNode(parseTree.getChild(i), node, "M"));
                } else {
                    traverseTree(parseTree.getChild(i), node);
                }
            }


        } else {

            switch (parent.getPayload()) {
                case "VariableDeclaratorIdContext":
                case "ExpressionNameContext":
                case "AccessFieldContext":
                case "TypeNameContext":
                case "FieldAccess":
                    node = new TreeNode(parseTree, parent, "V");
                    break;

                case "MethodNameContext":
                    node = new TreeNode(parseTree, parent, "M");
                    break;

                default:
                    String payload = (childCount == 0) ? parseTree.getText() : ctx;

                    node = new TreeNode(parseTree, parent, payload);
                    for (int i = 0; i < childCount; i++) {
                        traverseTree(parseTree.getChild(i), node);
                    }
            }

        }

        parent.getChildren().add(node);
        return node;
    }

}
