using VietJob.Debugging;

namespace VietJob.Entities;

public class VietJobConsts
{
    public const string LocalizationSourceName = "VietJob";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "c6917fdd5eed4fcd8596a3e46914b05b";
}
