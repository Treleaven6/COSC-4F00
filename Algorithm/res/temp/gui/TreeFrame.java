package temp.gui;

import temp.io.SourceFile;
import org.antlr.v4.gui.TreeViewer;
import org.antlr.v4.runtime.tree.Tree;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;

public class TreeFrame {

    JComponent view;

    public TreeFrame(String label, String[] rules, Tree tree) {

        JLabel title = new JLabel(label);
        title.setAlignmentX(Component.CENTER_ALIGNMENT);
        TreeViewer viewer = new TreeViewer(Arrays.asList(rules), tree);
//        viewer.setScale(1);

        this.view = Box.createVerticalBox();

        this.view.add(title);
        this.view.add(viewer);
    }

    public void launch(String title) {
        JFrame frame = new JFrame(title);
        JScrollPane pane = new JScrollPane(view);

        frame.add(pane);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600,500);
        frame.setVisible(true);
    }

    public static void launch(SourceFile file, String[] ruleNames, Tree tree) {

        TreeFrame frame = new TreeFrame(file.getGrammar().toString(), ruleNames, tree);
        frame.launch("TreeViewer: "+ file.getFile().getName() );

    }

    public JComponent getView() {
        return this.view;
    }

}

