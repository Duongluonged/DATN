using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace VietJob_DATN.Localization;

public static class VietJob_DATNLocalizationConfigurer
{
    public static void Configure(ILocalizationConfiguration localizationConfiguration)
    {
        localizationConfiguration.Sources.Add(
            new DictionaryBasedLocalizationSource(VietJob_DATNConsts.LocalizationSourceName,
                new XmlEmbeddedFileLocalizationDictionaryProvider(
                    typeof(VietJob_DATNLocalizationConfigurer).GetAssembly(),
                    "VietJob_DATN.Localization.SourceFiles"
                )
            )
        );
    }
}
