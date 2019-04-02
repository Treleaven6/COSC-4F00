package temp;

import java.io.File;

public enum Grammar {
    C("C", "11", ".c"), CPP("C++", "14", ".cpp"), JAVA("Java", "8", ".java");

    String string;
    String version;
    String extension;

    Grammar(String string, String version, String extension) {
        this.string = string;
        this.version = version;
        this.extension = extension;
    }

    @Override
    public String toString() {
        return this.string;
    }

    public String getVersion() {
        return this.version;
    }

    public String getExtension() {
        return this.extension;
    }

    public static Grammar getGrammarFromPath(String path) {

        File file = new File(path);

        for (Grammar grammar : Grammar.values()) {
            if (grammar.getExtension().equalsIgnoreCase(file.getName().substring(file.getName().lastIndexOf(".")))) {
                return grammar;
            }
        }

        return null;

    }

}