package drjava.tree;

import org.antlr.v4.runtime.tree.Tree;

import java.io.FileWriter;
import java.io.IOException;

public class TreeWriter extends FileWriter {

    private final Tree tree;

    public TreeWriter(String fileName, Tree tree) throws IOException {
        super(fileName);
        this.tree = tree;
    }

    public void save() {
        try {
            writeTree(tree);
            this.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void writeTree(Tree tree) throws IOException {

        if (tree.getChildCount() == 0) {
            String payload = (String) tree.getPayload();

            this.write(payload);

// Code below is used to roughly re-space a file
//
//            this.write(payload + " ");
//
//            if (payload.equalsIgnoreCase(";")) {
//                this.write("\n");
//            } else if (payload.equalsIgnoreCase("{") || payload.equalsIgnoreCase("}")) {
//                this.write("\n\n");
//            }
//

        } else {
            for (int i=0; i<tree.getChildCount(); i++) {
                writeTree(tree.getChild(i));
            }
        }
    }

}
