package temp.gui;

import org.antlr.v4.runtime.tree.Tree;

import javax.swing.*;

public class MultiTreeFrame {

    JComponent view;

    public MultiTreeFrame(String[] label, String[][] rules, Tree[] tree) {

        this.view = Box.createHorizontalBox();

        for (int i=0; i<label.length; i++) {
            TreeFrame elem = new TreeFrame(label[i], rules[i], tree[i]);
            this.view.add(elem.getView());
        }

    }

    public void launch(String title) {
        JFrame frame = new JFrame(title);
        JScrollPane pane = new JScrollPane(view);

        frame.add(pane);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600,500);
        frame.setVisible(true);
    }

}
