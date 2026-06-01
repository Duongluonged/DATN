using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;
using VietJob.Entities;

namespace VietJob.Localization;

public static class VietJobLocalizationConfigurer
{
    public static void Configure(ILocalizationConfiguration localizationConfiguration)
    {
        localizationConfiguration.Sources.Add(
            new DictionaryBasedLocalizationSource(VietJobConsts.LocalizationSourceName,
                new XmlEmbeddedFileLocalizationDictionaryProvider(
                    typeof(VietJobLocalizationConfigurer).GetAssembly(),
                    "VietJob.Localization.SourceFiles"
                )
            )
        );
    }
}
