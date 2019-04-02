package ca.brocku.cosc3p97.server;


import com.google.cloud.translate.Language;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.Translate.TranslateOption;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

import java.util.List;

/**
 * Created by Trevor Vanderee on 2017-12-21.
 */
public class Translator {

    private static Translator translator;
    private Translate translate;

    private Translator() {
        translate = TranslateOptions.getDefaultInstance().getService();
    }

    public static Translator getInstance(){
        if(translator==null){
            translator = new Translator();
        }
        return translator;
    }

    public String translate(String text, String sourceLang, String targLang){
        Translation result = translate.translate(text,TranslateOption.sourceLanguage(sourceLang),TranslateOption.targetLanguage(targLang));
        return result.getTranslatedText();
    }

    public void getSupportedLanguages() {
        List<Language> languageList = translate.listSupportedLanguages();
        for (Language language : languageList) {

            System.out.printf(
                    "INSERT INTO Language(LanguageCode, LanguageName, DefaultMessage) values ('%s', '%s', N'%s')%n",
                    language.getCode(),
                    language.getName(),
                    (language.getCode().equalsIgnoreCase("en"))?"Say Hello" :translate("Say Hello", "en", language.getCode())
            );
        }
    }
}
