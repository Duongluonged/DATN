using Abp.Application.Services.Dto;

public class PagedJobResultRequestDto : PagedAndSortedResultRequestDto
{
    public string Keyword { get; set; }     // Tìm theo tiêu đề hoặc tên công ty
    public string Skill { get; set; }       // Lọc theo kỹ năng (React, Java, .NET...)
    public string Location { get; set; }    // Lọc theo Thành phố
    public int? MinSalary { get; set; }     // Lương tối thiểu từ...
    public string JobLevel { get; set; }    // Lọc theo cấp bậc (Fresher, Junior, Senior)
}