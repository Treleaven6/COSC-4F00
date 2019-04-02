package temp;

import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.Tree;

import java.util.LinkedList;
import java.util.List;

public class SyntaxTree implements Tree {

    public static SyntaxTree Build(ParseTree tree) {
        SyntaxTree root = new SyntaxTree(null, tree.getClass().getName(), null);
        populateTree(root, tree);
        return root;
    }

    private static void populateTree(SyntaxTree parent, ParseTree tree) {


        if (tree.getChildCount() == 0) {
            SyntaxTree node = new SyntaxTree(parent, tree.getText() , null);
            parent.children.add(node);

        } else if (tree.getChildCount() == 1
                || tree.getChildCount() == 2 && tree.getChild(1).getText().equals("<EOF>")
        ) {

            populateTree(parent, tree.getChild(0));

        } else {

            SyntaxTree node = new SyntaxTree(parent, tree.getClass().getSimpleName().replace("Context", ""), null);
            parent.children.add(node);

            for (int i=0; i<tree.getChildCount(); i++) {
                populateTree(node, tree.getChild(i));
            }

        }
    }

    private final Tree parent;
    private final Object payload;
    private final List<Tree> children;

    private SyntaxTree(SyntaxTree parent, Object payload, List<Tree> children) {
        this.parent = parent;
        this.payload = payload;
        this.children = (children==null) ? new LinkedList<Tree>() : children;
    }

    @Override
    public Tree getParent() {
        return this.parent;
    }

    @Override
    public Object getPayload() {
        return this.payload;
    }

    @Override
    public Tree getChild(int i) {
        return children.get(i);
    }

    @Override
    public int getChildCount() {
        return children.size();
    }

    @Override
    public String toStringTree() {
        return "TODO - toStringTree()";
    }

}
