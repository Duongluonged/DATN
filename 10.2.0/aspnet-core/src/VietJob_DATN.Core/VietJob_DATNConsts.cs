using VietJob_DATN.Debugging;

namespace VietJob_DATN;

public class VietJob_DATNConsts
{
    public const string LocalizationSourceName = "VietJob_DATN";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = false;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "7330e64171ec48b09bff9618268d4a78";
}
