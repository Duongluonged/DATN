using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VietJob_DATN.Applies;
using VietJob_DATN.Authorization.Roles;
using VietJob_DATN.Authorization.Users;
using VietJob_DATN.Candidates;
using VietJob_DATN.Courses;
using VietJob_DATN.Employers;
using VietJob_DATN.Jobs;
using VietJob_DATN.MultiTenancy;

namespace VietJob_DATN.EntityFrameworkCore;

public class VietJob_DATNDbContext : AbpZeroDbContext<Tenant, Role, User, VietJob_DATNDbContext>
{
    /* Define a DbSet for each entity of the application */
    public virtual DbSet<Candidate> Candidates { get; set; }
    public virtual DbSet<Employer> Employers{ get; set; }
    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }
    public virtual DbSet<ApplyJob> ApplyJobs { get; set; }
    public VietJob_DATNDbContext(DbContextOptions<VietJob_DATNDbContext> options)
        : base(options)
    {
    }
}
