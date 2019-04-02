package temp.main;

import org.antlr.v4.runtime.tree.ParseTree;

public class TreeBuilder {



    public static BaseTree BuildJava8BlockStatementTree(ParseTree tree) {
        BaseTree root = new BaseTree(null, "root", null);
//        buildJava8BlockStatementTree(root, tree);
        return root;
    }

    private static BaseTree buildJava8BlockStatementTree(ParseTree parseTree) {

        if (getContext(parseTree).equalsIgnoreCase("BlockStatementContext")) {

        } else {

            for (int i=0; i<parseTree.getChildCount(); i++) {

            }
        }



        return null;
    }

    private static String getContext(ParseTree parseTree) {
        return parseTree.getClass().getSimpleName();
    }




}
