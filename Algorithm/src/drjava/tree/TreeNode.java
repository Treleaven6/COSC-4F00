package drjava.tree;

import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.Tree;

import java.util.ArrayList;
import java.util.List;

public class TreeNode implements Tree {

    private ParseTree parseTree;
    private Tree parent;
    private String payload;
    private List<Tree> children;

    public TreeNode(ParseTree parseTree, Tree parent, String payload, List<Tree> children) {
        this.parseTree = parseTree;
        this.parent = parent;
        this.payload = payload;
        this.children = children;
    }

    public TreeNode(ParseTree parseTree, Tree parent, String payload) {
        this(parseTree, parent, payload, new ArrayList<>());
    }

    public ParseTree getParseTree() {
        return parseTree;
    }

    @Override
    public Tree getParent() {
        return this.parent;
    }

    @Override
    public String getPayload() {
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

    public List<Tree> getChildren() {
        return children;
    }

    @Override
    public String toStringTree() {
        StringBuilder stringBuilder = new StringBuilder(payload);

        for (int i=0; i<getChildCount(); i++) {
            stringBuilder.append(" ");
            stringBuilder.append(getChild(i).toStringTree());
        }

        return stringBuilder.toString();
    }

}
