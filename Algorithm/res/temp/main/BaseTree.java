package temp.main;

import org.antlr.v4.runtime.tree.Tree;

import java.util.LinkedList;
import java.util.List;

public class BaseTree implements Tree{

    private final Tree parent;
    private final Object payload;
    private final List<Tree> children;

    public BaseTree(MyTree parent, Object payload, List<Tree> children) {
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
        return payload.toString();
    }

}