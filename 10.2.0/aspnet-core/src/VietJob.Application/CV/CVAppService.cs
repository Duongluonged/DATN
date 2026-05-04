using Abp.Application.Services;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

public class CVAppService : ApplicationService
{
    private readonly IRepository<CV, int> _cvRepo;

    public CVAppService(IRepository<CV, int> cvRepo)
    {
        _cvRepo = cvRepo;
    }

    // 🟢 Lấy danh sách CV
    public async Task<List<CV>> GetByUngVien(int ungVienId)
    {
        return await _cvRepo.GetAll()
            .Where(x => x.UngVienId == ungVienId)
            .ToListAsync();
    }

    // 🟢 Tạo CV
    public async Task Create(CVDto input)
    {
        var cv = new CV
        {   
            UngVienId = input.UngVienId,
               TieuDe = input.TieuDe,   
            DuongDanFile = input.DuongDanFile,
            NgayTao = DateTime.Now
        };

        await _cvRepo.InsertAsync(cv);
    }

    // 🟢 Update
    public async Task Update(CVDto input)
    {
        var cv = await _cvRepo.GetAsync(input.Id);

        cv.UngVienId = input.UngVienId;
        cv.DuongDanFile = input.DuongDanFile;
        cv.TieuDe = input.TieuDe;
        await _cvRepo.UpdateAsync(cv);
    }

    // 🟢 Delete
    public async Task Delete(int id)
    {
        await _cvRepo.DeleteAsync(id);
    }
}