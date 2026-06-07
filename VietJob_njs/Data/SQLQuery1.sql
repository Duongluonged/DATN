USE [VietJob_DATN]
GO
/****** Object:  Table [dbo].[AbpUsers]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AbpUsers](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[AuthenticationSource] [nvarchar](64) NULL,
	[ConcurrencyStamp] [nvarchar](128) NULL,
	[CreationTime] [datetime2](7) NOT NULL,
	[CreatorUserId] [bigint] NULL,
	[DeleterUserId] [bigint] NULL,
	[DeletionTime] [datetime2](7) NULL,
	[EmailAddress] [nvarchar](256) NOT NULL,
	[EmailConfirmationCode] [nvarchar](328) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsEmailConfirmed] [bit] NOT NULL,
	[IsLockoutEnabled] [bit] NOT NULL,
	[IsPhoneNumberConfirmed] [bit] NOT NULL,
	[IsTwoFactorEnabled] [bit] NOT NULL,
	[LastModificationTime] [datetime2](7) NULL,
	[LastModifierUserId] [bigint] NULL,
	[LockoutEndDateUtc] [datetime2](7) NULL,
	[Name] [nvarchar](64) NOT NULL,
	[NormalizedEmailAddress] [nvarchar](256) NOT NULL,
	[NormalizedUserName] [nvarchar](256) NOT NULL,
	[Password] [nvarchar](128) NOT NULL,
	[PasswordResetCode] [nvarchar](328) NULL,
	[PhoneNumber] [nvarchar](32) NULL,
	[SecurityStamp] [nvarchar](128) NULL,
	[Surname] [nvarchar](64) NOT NULL,
	[TenantId] [int] NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_AbpUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppCandidates]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppCandidates](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[FullName] [nvarchar](256) NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Skills] [nvarchar](max) NULL,
	[Education] [nvarchar](max) NULL,
	[Experience] [nvarchar](max) NULL,
	[CvPath] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[CreationTime] [datetime2](7) NOT NULL,
	[CreatorUserId] [bigint] NULL,
	[LastModificationTime] [datetime2](7) NULL,
	[LastModifierUserId] [bigint] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeleterUserId] [bigint] NULL,
	[DeletionTime] [datetime2](7) NULL,
 CONSTRAINT [PK_AppCandidates] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Applications]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Applications](
	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[JobID] [int] NOT NULL,
	[CandidateName] [nvarchar](255) NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[City] [nvarchar](100) NULL,
	[CoverLetter] [nvarchar](max) NULL,
	[CV_Path] [nvarchar](max) NULL,
	[AppliedAt] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[UserId] [int] NULL,
	[InterviewDate] [nvarchar](100) NULL,
	[InterviewFormat] [nvarchar](100) NULL,
	[InterviewLocation] [nvarchar](500) NULL,
	[InterviewNote] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CandidateCv]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CandidateCv](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Bio] [nvarchar](max) NULL,
	[Skills] [nvarchar](max) NULL,
	[CreatedAt] [datetime] NULL,
	[CvFilePath] [nvarchar](2000) NULL,
	[CvFileName] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CandidateFiles]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CandidateFiles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[FileName] [nvarchar](500) NOT NULL,
	[FileUrl] [nvarchar](2000) NOT NULL,
	[FileSize] [int] NULL,
	[UploadedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Companies]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Companies](
	[CompanyID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyName] [nvarchar](255) NOT NULL,
	[LogoURL] [nvarchar](500) NULL,
	[Description] [nvarchar](max) NULL,
	[WebsiteURL] [nvarchar](255) NULL,
	[Location] [nvarchar](100) NULL,
	[IsHot] [bit] NULL,
	[CreatedAt] [datetime] NULL,
	[Industry] [nvarchar](255) NULL,
	[Size] [nvarchar](100) NULL,
	[Country] [nvarchar](100) NULL,
	[WorkingTime] [nvarchar](255) NULL,
	[AverageSalary] [nvarchar](100) NULL,
	[Rating] [decimal](2, 1) NULL,
	[ReviewCount] [int] NULL,
	[LongDescription] [nvarchar](max) NULL,
	[Hotline] [varchar](20) NULL,
	[OfficePhotos] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[CompanyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompanyReviews]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompanyReviews](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompanyId] [int] NOT NULL,
	[UserId] [int] NULL,
	[Rating] [int] NOT NULL,
	[Summary] [nvarchar](500) NOT NULL,
	[OvertimePolicy] [nvarchar](50) NULL,
	[OvertimeReason] [nvarchar](1000) NULL,
	[LoveWorking] [nvarchar](max) NULL,
	[Suggestion] [nvarchar](max) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CvEducation]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CvEducation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CvId] [int] NOT NULL,
	[SchoolName] [nvarchar](255) NOT NULL,
	[Major] [nvarchar](255) NOT NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CvExperience]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CvExperience](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CvId] [int] NOT NULL,
	[CompanyName] [nvarchar](255) NOT NULL,
	[Position] [nvarchar](100) NOT NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[Description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[JobReports]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JobReports](
	[ReportID] [int] IDENTITY(1,1) NOT NULL,
	[JobID] [int] NOT NULL,
	[UserId] [int] NULL,
	[Reason] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Status] [nvarchar](50) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReportID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Jobs]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Jobs](
	[JobID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyID] [int] NULL,
	[JobTitle] [nvarchar](255) NOT NULL,
	[SalaryRange] [nvarchar](100) NULL,
	[JobType] [nvarchar](50) NULL,
	[Experience] [nvarchar](100) NULL,
	[Location] [nvarchar](255) NULL,
	[Description] [nvarchar](max) NULL,
	[IsActive] [bit] NULL,
	[CreatedAt] [datetime] NULL,
	[Skills] [nvarchar](max) NULL,
	[JobLevel] [nvarchar](100) NULL,
	[Gender] [nvarchar](50) NULL,
	[ApplicationDeadline] [datetime] NULL,
	[Requirements] [nvarchar](max) NULL,
	[Benefits] [nvarchar](max) NULL,
	[IsHighlighted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[JobID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[JobSkills]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JobSkills](
	[JobID] [int] NOT NULL,
	[SkillID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[JobID] ASC,
	[SkillID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[khoa_hoc]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[khoa_hoc](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NhaTuyenDungId] [int] NOT NULL,
	[TieuDe] [nvarchar](max) NULL,
	[MoTa] [nvarchar](max) NULL,
	[TrangThai] [nvarchar](max) NULL,
	[CreationTime] [datetime2](7) NOT NULL,
	[CreatorUserId] [bigint] NULL,
	[LastModificationTime] [datetime2](7) NULL,
	[LastModifierUserId] [bigint] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeleterUserId] [bigint] NULL,
	[DeletionTime] [datetime2](7) NULL,
	[Category] [nvarchar](50) NULL,
	[Rating] [decimal](2, 1) NULL,
	[ReviewsCount] [int] NULL,
	[Duration] [nvarchar](50) NULL,
	[LecturesCount] [int] NULL,
	[Level] [nvarchar](50) NULL,
	[InstructorName] [nvarchar](100) NULL,
	[InstructorRole] [nvarchar](150) NULL,
	[Price] [int] NULL,
	[OldPrice] [int] NULL,
	[DriveLink] [nvarchar](500) NULL,
 CONSTRAINT [PK_khoa_hoc] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[MessageID] [int] IDENTITY(1,1) NOT NULL,
	[SenderID] [int] NOT NULL,
	[ReceiverID] [int] NOT NULL,
	[MessageContent] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[IsRead] [bit] NULL,
	[AttachmentURL] [nvarchar](max) NULL,
	[AttachmentName] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[MessageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notifications]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notifications](
	[NotificationID] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Type] [nvarchar](50) NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[IsRead] [bit] NOT NULL,
	[CreatedAt] [datetime] NULL,
	[RelatedID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[NotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PopularKeywords]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PopularKeywords](
	[KeywordID] [int] IDENTITY(1,1) NOT NULL,
	[KeywordName] [nvarchar](100) NOT NULL,
	[SearchCount] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[KeywordID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Skills]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Skills](
	[SkillID] [int] IDENTITY(1,1) NOT NULL,
	[SkillName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SkillID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transactions]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transactions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[Amount] [int] NOT NULL,
	[Type] [nvarchar](50) NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[RefCode] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Courses]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Courses](
	[UserCourseID] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[CourseId] [nvarchar](100) NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[LastModifiedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserCourseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoles]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[Status] [nvarchar](20) NULL,
	[Phone] [varchar](20) NULL,
	[Address] [nvarchar](250) NULL,
	[CompanyID] [int] NULL,
	[Balance] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AbpUsers] ON 

INSERT [dbo].[AbpUsers] ([Id], [AccessFailedCount], [AuthenticationSource], [ConcurrencyStamp], [CreationTime], [CreatorUserId], [DeleterUserId], [DeletionTime], [EmailAddress], [EmailConfirmationCode], [IsActive], [IsDeleted], [IsEmailConfirmed], [IsLockoutEnabled], [IsPhoneNumberConfirmed], [IsTwoFactorEnabled], [LastModificationTime], [LastModifierUserId], [LockoutEndDateUtc], [Name], [NormalizedEmailAddress], [NormalizedUserName], [Password], [PasswordResetCode], [PhoneNumber], [SecurityStamp], [Surname], [TenantId], [UserName]) VALUES (3, 0, NULL, N'965e8f71-8abc-44a6-9a24-0eb28322b26d', CAST(N'2026-04-07T10:52:01.4952130' AS DateTime2), NULL, NULL, NULL, N'luongduong@gmail.com', NULL, 1, 0, 1, 1, 0, 0, CAST(N'2026-04-18T09:42:16.4005540' AS DateTime2), NULL, CAST(N'2026-04-18T02:47:16.3893572' AS DateTime2), N'Duong', N'LUONGDUONG@GMAIL.COM', N'DUONGSU', N'AQAAAAIAAYagAAAAEBdbKkbqNRCKfJgV2H7135WRBIRopZ6D8/pXvBqB6S0R6u/V6tU+BwS6vY/z/g==', NULL, NULL, N'RD5SXDDIVY7L4PRD4E5PTYGWG2QHFZAH', N'Luong', 1, N'DuongSu')
INSERT [dbo].[AbpUsers] ([Id], [AccessFailedCount], [AuthenticationSource], [ConcurrencyStamp], [CreationTime], [CreatorUserId], [DeleterUserId], [DeletionTime], [EmailAddress], [EmailConfirmationCode], [IsActive], [IsDeleted], [IsEmailConfirmed], [IsLockoutEnabled], [IsPhoneNumberConfirmed], [IsTwoFactorEnabled], [LastModificationTime], [LastModifierUserId], [LockoutEndDateUtc], [Name], [NormalizedEmailAddress], [NormalizedUserName], [Password], [PasswordResetCode], [PhoneNumber], [SecurityStamp], [Surname], [TenantId], [UserName]) VALUES (4, 0, NULL, N'319a69ea-0026-4732-8596-1f2ddf23c556', CAST(N'2026-04-07T16:24:10.5225509' AS DateTime2), NULL, NULL, NULL, N'luongduongess@gmail.com', NULL, 1, 0, 1, 1, 0, 0, CAST(N'2026-04-18T10:25:29.7792065' AS DateTime2), NULL, CAST(N'2026-04-18T03:30:29.7743932' AS DateTime2), N'Duong', N'LUONGDUONGESS@GMAIL.COM', N'DUONGLUONG', N'AQAAAAIAAYagAAAAEPxaVKzetXax1bBgCljoBZAqleIU0uiFBOw3c2bt9HnyZPruyhyPgwDradlK9IUCOQ==', NULL, NULL, N'UZ52HGJNB2YPJANYPC2WP65K5CBDXYIJ', N'Luong', 1, N'DuongLuong')
INSERT [dbo].[AbpUsers] ([Id], [AccessFailedCount], [AuthenticationSource], [ConcurrencyStamp], [CreationTime], [CreatorUserId], [DeleterUserId], [DeletionTime], [EmailAddress], [EmailConfirmationCode], [IsActive], [IsDeleted], [IsEmailConfirmed], [IsLockoutEnabled], [IsPhoneNumberConfirmed], [IsTwoFactorEnabled], [LastModificationTime], [LastModifierUserId], [LockoutEndDateUtc], [Name], [NormalizedEmailAddress], [NormalizedUserName], [Password], [PasswordResetCode], [PhoneNumber], [SecurityStamp], [Surname], [TenantId], [UserName]) VALUES (5, 0, NULL, N'd6e58084-0d7b-448b-a43c-8093f95118a3', CAST(N'2026-04-09T10:02:43.9602587' AS DateTime2), NULL, NULL, NULL, N'admin@aspnetboilerplate.com', NULL, 1, 0, 1, 0, 0, 0, NULL, NULL, NULL, N'admin', N'ADMIN@ASPNETBOILERPLATE.COM', N'ADMIN', N'AQAAAAIAAYagAAAAEHUsEdKjFi8BpjsYkV96QfSqGuLTlZFWyvO+1OalnNyYA+VId+8p5jf8vniungFaWw==', NULL, NULL, N'd668d6cb-1c5c-97d9-29f1-3a20825e03f8', N'admin', NULL, N'admin')
INSERT [dbo].[AbpUsers] ([Id], [AccessFailedCount], [AuthenticationSource], [ConcurrencyStamp], [CreationTime], [CreatorUserId], [DeleterUserId], [DeletionTime], [EmailAddress], [EmailConfirmationCode], [IsActive], [IsDeleted], [IsEmailConfirmed], [IsLockoutEnabled], [IsPhoneNumberConfirmed], [IsTwoFactorEnabled], [LastModificationTime], [LastModifierUserId], [LockoutEndDateUtc], [Name], [NormalizedEmailAddress], [NormalizedUserName], [Password], [PasswordResetCode], [PhoneNumber], [SecurityStamp], [Surname], [TenantId], [UserName]) VALUES (6, 0, NULL, N'cd24e927-b4f5-445a-97d7-32d6342f139a', CAST(N'2026-04-09T10:02:44.3896415' AS DateTime2), NULL, NULL, NULL, N'admin@defaulttenant.com', NULL, 1, 0, 1, 0, 0, 0, CAST(N'2026-04-18T09:43:36.2666515' AS DateTime2), NULL, NULL, N'admin', N'ADMIN@DEFAULTTENANT.COM', N'ADMIN', N'AQAAAAIAAYagAAAAEG/oQhCuv/3R/1zLqzgDEI7JNPvIz5KM5e3PZraaiZKbaZFj6DC27QwjQ4cosMUUww==', NULL, NULL, N'cc8bcbd8-a1ca-8797-da5e-3a20825e05a5', N'admin', 1, N'admin')
INSERT [dbo].[AbpUsers] ([Id], [AccessFailedCount], [AuthenticationSource], [ConcurrencyStamp], [CreationTime], [CreatorUserId], [DeleterUserId], [DeletionTime], [EmailAddress], [EmailConfirmationCode], [IsActive], [IsDeleted], [IsEmailConfirmed], [IsLockoutEnabled], [IsPhoneNumberConfirmed], [IsTwoFactorEnabled], [LastModificationTime], [LastModifierUserId], [LockoutEndDateUtc], [Name], [NormalizedEmailAddress], [NormalizedUserName], [Password], [PasswordResetCode], [PhoneNumber], [SecurityStamp], [Surname], [TenantId], [UserName]) VALUES (7, 0, NULL, N'99c70ccc-3c38-4902-ab24-611f401f89fe', CAST(N'2026-04-18T10:31:12.4342228' AS DateTime2), NULL, NULL, NULL, N'daiduong@gmail.com', NULL, 1, 0, 1, 1, 0, 0, NULL, NULL, NULL, N'Duong', N'DAIDUONG@GMAIL.COM', N'DAIDUONG', N'AQAAAAIAAYagAAAAEOP+ZC1l9eSxRP3+UZutuxAP4QkKXmHs0gUZRDfrVyb5XjmHxNOHUSA+qWHk3KP0BA==', NULL, NULL, N'JY7CGP3V4B4DHRNTSTWXZHYXN2EFR2B3', N'Dai', 1, N'DaiDuong')
SET IDENTITY_INSERT [dbo].[AbpUsers] OFF
GO
SET IDENTITY_INSERT [dbo].[AppCandidates] ON 

INSERT [dbo].[AppCandidates] ([Id], [UserId], [FullName], [Title], [Skills], [Education], [Experience], [CvPath], [PhoneNumber], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime]) VALUES (1, 4, N'LuongDaiDuong', N'UT 3D', N'Blen', N'Univers', N'2 years', N'http://Duong', N'0989460482', CAST(N'2026-04-07T16:37:32.9393985' AS DateTime2), 4, NULL, NULL, 1, 4, CAST(N'2026-04-07T16:46:37.3512689' AS DateTime2))
INSERT [dbo].[AppCandidates] ([Id], [UserId], [FullName], [Title], [Skills], [Education], [Experience], [CvPath], [PhoneNumber], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime]) VALUES (2, 3, N'DoThao', N'Intern', N'Luat', N'Univer', N'3 years', N'http://Thao', N'0386283669', CAST(N'2026-04-07T16:41:00.8139765' AS DateTime2), 4, CAST(N'2026-04-07T16:44:20.4332331' AS DateTime2), 4, 1, 4, CAST(N'2026-04-07T16:45:47.4221385' AS DateTime2))
SET IDENTITY_INSERT [dbo].[AppCandidates] OFF
GO
SET IDENTITY_INSERT [dbo].[Applications] ON 

INSERT [dbo].[Applications] ([ApplicationID], [JobID], [CandidateName], [Phone], [City], [CoverLetter], [CV_Path], [AppliedAt], [Status], [UserId], [InterviewDate], [InterviewFormat], [InterviewLocation], [InterviewNote]) VALUES (5, 16, N'Nguyễn Thị Hoài', N'0983967742', N'Hồ Chí Minh', N'Thế mà lại hay', N'existing_cv.pdf', CAST(N'2026-05-23T10:18:52.827' AS DateTime), N'Phỏng vấn', 12, NULL, NULL, NULL, NULL)
INSERT [dbo].[Applications] ([ApplicationID], [JobID], [CandidateName], [Phone], [City], [CoverLetter], [CV_Path], [AppliedAt], [Status], [UserId], [InterviewDate], [InterviewFormat], [InterviewLocation], [InterviewNote]) VALUES (6, 15, N'Nguyễn Minh Thắng', N'0989460482', N'Hồ Chí Minh', N'Béo vl', N'existing_cv.pdf', CAST(N'2026-05-23T11:02:18.687' AS DateTime), N'Phỏng vấn', 15, NULL, NULL, NULL, NULL)
INSERT [dbo].[Applications] ([ApplicationID], [JobID], [CandidateName], [Phone], [City], [CoverLetter], [CV_Path], [AppliedAt], [Status], [UserId], [InterviewDate], [InterviewFormat], [InterviewLocation], [InterviewNote]) VALUES (7, 14, N'Nguyễn Minh Thắng', N'0989460482', N'Hồ Chí Minh', N'Hay', N'existing_cv.pdf', CAST(N'2026-05-23T11:10:37.923' AS DateTime), N'Phỏng vấn', 15, N'15:34 26/05/2026', N'Online (Google Meet / Zoom)', N'Sẽ gửi link họp sau', NULL)
INSERT [dbo].[Applications] ([ApplicationID], [JobID], [CandidateName], [Phone], [City], [CoverLetter], [CV_Path], [AppliedAt], [Status], [UserId], [InterviewDate], [InterviewFormat], [InterviewLocation], [InterviewNote]) VALUES (8, 14, N'Nguyễn Thị Hoài', NULL, N'Hồ Chí Minh', N'hay nuôn', N'http://localhost:5000/uploads/1780207850202_main-assembly-master-.pdf', CAST(N'2026-05-31T13:11:00.437' AS DateTime), N'Phỏng vấn', 12, N'13:11 31/05/2026', N'Online (Google Meet / Zoom)', N'kkk', N'chuẩn bị tinh thần')
INSERT [dbo].[Applications] ([ApplicationID], [JobID], [CandidateName], [Phone], [City], [CoverLetter], [CV_Path], [AppliedAt], [Status], [UserId], [InterviewDate], [InterviewFormat], [InterviewLocation], [InterviewNote]) VALUES (9, 20, N'luong thanh tung', N'0961169306', N'Hồ Chí Minh', N'Hay', NULL, CAST(N'2026-06-02T12:19:14.010' AS DateTime), N'Phỏng vấn', 19, N'12:20 02/06/2026', N'Online (Google Meet / Zoom)', N'ok', N'Chuan bi CV')
SET IDENTITY_INSERT [dbo].[Applications] OFF
GO
SET IDENTITY_INSERT [dbo].[CandidateCv] ON 

INSERT [dbo].[CandidateCv] ([Id], [UserId], [Bio], [Skills], [CreatedAt], [CvFilePath], [CvFileName]) VALUES (2, 12, N'Haha', NULL, CAST(N'2026-05-25T17:25:39.240' AS DateTime), NULL, NULL)
SET IDENTITY_INSERT [dbo].[CandidateCv] OFF
GO
SET IDENTITY_INSERT [dbo].[Companies] ON 

INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (1, N'ANDPAD VietNam Co., Ltd', N'https://link-logo-apple.png', N'Mô tả công việc mặc định', N'https://google.com', N'TP. Hồ Chí Minh', 1, CAST(N'2026-04-29T14:32:24.870' AS DateTime), N'Sản phẩm', N'100-200 nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'86 US$', CAST(4.3 AS Decimal(2, 1)), 500, N'ANDPAD là nền tảng quản lý xây dựng số 1 tại Nhật Bản, hiện đang mở rộng mạnh mẽ tại Việt Nam.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (2, N'Apple Store', N'https://cdn-icons-png.flaticon.com/512/882/882704.png', N'Gia nhập đội ngũ công nghệ hàng đầu', N'https://apple.com', N'Hà Nội', 1, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Bán lẻ công nghệ', N'1000+ nhân sự', N'Hoa Kỳ', N'Thoả thuận', N'150 US$', CAST(4.8 AS Decimal(2, 1)), 1200, N'Môi trường làm việc đẳng cấp thế giới với các sản phẩm công nghệ đột phá.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (3, N'Google Corp', N'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', N'Môi trường sáng tạo toàn cầu', N'https://google.com', N'Đà Nẵng', 1, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Dịch vụ Internet', N'10000+ nhân sự', N'Hoa Kỳ', N'Linh hoạt', N'200 US$', CAST(4.9 AS Decimal(2, 1)), 3500, N'Google luôn nằm trong top những nơi làm việc tốt nhất hành tinh với chế độ đãi ngộ cực cao.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (4, N'FPT Software', N'https://link-logo-fpt.png', N'Công ty công nghệ hàng đầu Việt Nam', N'https://fpt-software.com', N'TP. Hồ Chí Minh', 0, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Outsourcing', N'30000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'45 US$', CAST(4.0 AS Decimal(2, 1)), 2100, N'Công ty xuất khẩu phần mềm lớn nhất Việt Nam với cơ hội làm việc tại Nhật Bản, Mỹ, Châu Âu.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (5, N'VNG Corporation', N'https://link-logo-vng.png', N'Kỳ lân công nghệ hàng đầu Việt Nam với các sản phẩm Zalo, Zing.', N'https://vng.com.vn', N'TP. Hồ Chí Minh', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'Internet & Game', N'2000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'60 US$', CAST(4.2 AS Decimal(2, 1)), 850, N'Kỳ lân công nghệ đầu tiên của Việt Nam, sở hữu hệ sinh thái Zalo, Zing, VNGGames.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (6, N'Viettel Group', N'https://link-logo-viettel.png', N'Tập đoàn Công nghiệp - Viễn thông Quân đội.', N'https://viettel.com.vn', N'Hà Nội', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'Viễn thông & CNTT', N'50000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 7', N'55 US$', CAST(4.1 AS Decimal(2, 1)), 1500, N'Tập đoàn viễn thông lớn nhất Việt Nam, tiên phong trong lĩnh vực 5G và chuyển đổi số quốc gia.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (7, N'Shopee Vietnam', N'https://link-logo-shopee.png', N'Nền tảng thương mại điện tử phổ biến nhất khu vực.', N'https://shopee.vn', N'TP. Hồ Chí Minh', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'E-commerce', N'1500+ nhân sự', N'Singapore', N'Thứ 2 - Thứ 6', N'70 US$', CAST(4.4 AS Decimal(2, 1)), 900, N'Sàn thương mại điện tử hàng đầu Đông Nam Á với môi trường làm việc năng động, trẻ trung.', NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (8, N'Cty TNHH 1 Mjk Tao', N'http://localhost:5000/uploads/1779525857747_Picture1.svg', N'Chúng tôi là đơn vị tiên phong trong lĩnh vực giải pháp phần mềm, cam kết mang đến những sản phẩm công nghệ đột phá, tối ưu hóa quy trình vận hành và tạo ra giá trị bền vững cho đối tác và khách hàng', N'https://thaobeo.com', N'9 Đường Làng Thị Trấn Phú Xuyên Huyện Phú Xuyên Hà Nội 13906', 1, CAST(N'2026-05-21T15:13:40.360' AS DateTime), N'Công nghệ thông tin', N'1–10 người', N'Việt Nam', N'Thứ 2 - Thứ 6', N'2,000 USD', NULL, NULL, N'Về chúng tôi
Được thành lập với khát vọng chuyển đổi số, [Tên Công Ty] tự hào là đơn vị cung cấp các giải pháp công nghệ toàn diện từ phát triển phần mềm, ứng dụng di động cho đến tư vấn chuyển đổi số doanh nghiệp.
Sứ mệnh:
Xây dựng hệ sinh thái công nghệ thông minh, giúp các doanh nghiệp bứt phá trong kỷ nguyên số thông qua các giải pháp sáng tạo, bảo mật và hiệu quả cao.
Tầm nhìn:
Trở thành đối tác công nghệ tin cậy hàng đầu tại Việt Nam và khu vực, nơi hội tụ những tài năng công nghệ cùng nhau kiến tạo tương lai bền vững.
Giá trị cốt lõi:
Sáng tạo: Luôn cập nhật công nghệ mới nhất để giải quyết các bài toán khó.
Chất lượng: Đặt trải nghiệm người dùng và tính ổn định của hệ thống lên hàng đầu.
Tận tâm: Đồng hành cùng khách hàng trong suốt quá trình phát triển và vận hành.
Với đội ngũ kỹ sư tâm huyết và giàu kinh nghiệm, [Tên Công Ty] luôn sẵn sàng cùng bạn tạo nên những giá trị khác biệt.', N'0386283669', N'["http://localhost:5000/uploads/1779526250633_Picture3.svg","http://localhost:5000/uploads/1779700848247_365b24e2648883e3f11bd273778870d9.jpg"]')
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (9, N'Công ty TNHH Tungbeo', NULL, NULL, N'https://Tungbeo.com', N'PhuXuyen, HaNoi', 1, CAST(N'2026-05-23T09:43:42.757' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (10, N'VietJob Recruiter Inc', NULL, NULL, NULL, NULL, 0, CAST(N'2026-05-23T16:28:48.407' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Companies] ([CompanyID], [CompanyName], [LogoURL], [Description], [WebsiteURL], [Location], [IsHot], [CreatedAt], [Industry], [Size], [Country], [WorkingTime], [AverageSalary], [Rating], [ReviewCount], [LongDescription], [Hotline], [OfficePhotos]) VALUES (11, N'Công ty TNHH ABC', NULL, NULL, N'https://abc.com', N'175 Tây Sơn, Đống Đa, Hà Nội', 1, CAST(N'2026-06-01T14:50:39.713' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Companies] OFF
GO
SET IDENTITY_INSERT [dbo].[CompanyReviews] ON 

INSERT [dbo].[CompanyReviews] ([Id], [CompanyId], [UserId], [Rating], [Summary], [OvertimePolicy], [OvertimeReason], [LoveWorking], [Suggestion], [CreatedAt]) VALUES (1, 9, 12, 5, N'Hay ', N'satisfied', NULL, N'ăn', N'Chán', CAST(N'2026-05-27T11:34:29.140' AS DateTime))
SET IDENTITY_INSERT [dbo].[CompanyReviews] OFF
GO
SET IDENTITY_INSERT [dbo].[JobReports] ON 

INSERT [dbo].[JobReports] ([ReportID], [JobID], [UserId], [Reason], [Description], [Status], [CreatedAt]) VALUES (1, 15, 12, N'Nội dung công việc sai lệch hoàn toàn so với mô tả thực tế', NULL, N'Resolved', CAST(N'2026-05-25T15:40:57.740' AS DateTime))
SET IDENTITY_INSERT [dbo].[JobReports] OFF
GO
SET IDENTITY_INSERT [dbo].[Jobs] ON 

INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (3, 1, N'QA/QC Engineer', N'15tr - 25tr', N'Toàn thời gian', N'2 năm', N'Quận 1, TP.HCM', N'Kiểm soát chất lượng phần mềm và viết test case.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'ReactJS, HTML, CSS', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (4, 2, N'Data Scientist', N'25,000 - 45,000', N'Toàn thời gian', N'3 năm', N'Hà Nội', N'Phân tích dữ liệu lớn và xây dựng thuật toán dự báo.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Python, AI, Data Analysis', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Thành thạo Python và các thư viện AI. • Tư duy toán học và thuật toán tốt. • Ưu tiên ứng viên có kinh nghiệm xử lý Big Data.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (5, 2, N'DevOps Engineer', N'20,000 - 35,000', N'Linh hoạt (Hybrid)', N'2 năm', N'Hà Nội', N'Quản lý hạ tầng cloud và triển khai CI/CD.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Docker, Jenkins, AWS, CI/CD', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (6, 3, N'UI/UX Designer', N'12tr - 22tr', N'Toàn thời gian', N'1 năm', N'Đà Nẵng', N'Thiết kế trải nghiệm người dùng cho ứng dụng di động.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'UI/UX, Adobe XD, Figma, Mobile Design', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Tối thiểu 2 năm kinh nghiệm thiết kế UI/UX. • Sử dụng thành thạo Figma, Adobe XD. • Có tư duy về trải nghiệm người dùng tốt.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (7, 3, N'PHP Developer (Laravel)', N'15tr - 28tr', N'Toàn thời gian', N'2 năm', N'Đà Nẵng', N'Phát triển hệ thống quản lý nội dung.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'PHP, Laravel, MySQL, HTML/CSS', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (8, 4, N'Business Analyst (BA)', N'20tr - 35tr', N'Toàn thời gian', N'3 năm', N'TP. Hồ Chí Minh', N'Phân tích yêu cầu nghiệp vụ và làm cầu nối với khách hàng.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Data Analysis, SQL, Communication, Agile', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (9, 4, N'HR Manager', N'25tr - 40tr', N'Toàn thời gian', N'5 năm', N'TP. Hồ Chí Minh', N'Quản lý nhân sự và xây dựng văn hóa công ty.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Recruitment, Training, Communication, Excel', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (10, 5, N'Fullstack Developer (.NET & Angular)', N'30tr - 45tr', N'Toàn thời gian', N'4 năm', N'Hà Nội', N'Phát triển cả frontend và backend cho dự án.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'.NET Core, Angular, SQL Server, C#', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (11, 5, N'System Administrator', N'18tr - 28tr', N'Toàn thời gian', N'2 năm', N'Hà Nội', N'Quản trị hệ thống mạng và máy chủ.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Windows Server, Networking, Security, Linux', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (12, 6, N'Android Developer (Kotlin)', N'22tr - 35tr', N'Toàn thời gian', N'2 năm', N'TP. Hồ Chí Minh', N'Xây dựng ứng dụng native trên nền tảng Android.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Kotlin, Android Studio, Firebase, MVVM', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (13, 6, N'Content Creator', N'10tr - 18tr', N'Bán thời gian', N'Không yêu cầu', N'TP. Hồ Chí Minh', N'Sáng tạo nội dung truyền thông cho các nền tảng mạng xã hội.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Content Strategy, Copywriting, SEO, Social Media', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (14, 8, N'Fondent', N'12 triệu', N'Full-time', N'2 ănm', N'Ha Noi', N'aaaa', 1, CAST(N'2026-05-22T21:22:47.500' AS DateTime), N'Figma', N'Intern', N'Không yêu cầu', NULL, NULL, NULL, 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (15, 9, N'Frontend Developer (ReactJS)', N'12 triệu', N'Full-time', N'Không yêu cầu', N'Hà Nội', N'- Phát triển và bảo trì giao diện người dùng bằng ReactJS.
- Phối hợp với Backend Developer để tích hợp API.
- Tối ưu hiệu năng và trải nghiệm người dùng.
- Tham gia phân tích yêu cầu và đề xuất giải pháp kỹ thuật.
- Sửa lỗi và cải thiện các tính năng hiện có.', 1, CAST(N'2026-05-23T09:53:23.900' AS DateTime), N'ReactJS, JavaScript, HTML, CSS, REST API, Git', N'Intern', N'Không yêu cầu', NULL, NULL, NULL, 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (16, 9, N'Backend Developer (Node.js)', N'20 triệu', N'Full-time', N'2 năm', N'TP. Hồ Chí Minh', N'- Phát triển và bảo trì hệ thống backend sử dụng Node.js và ExpressJS.
- Thiết kế và tối ưu cơ sở dữ liệu SQL Server.
- Xây dựng RESTful API phục vụ Web và Mobile App.
- Tích hợp hệ thống xác thực JWT và phân quyền người dùng.
- Phối hợp với Frontend Developer và QA để triển khai sản phẩm.
- Tối ưu hiệu năng và bảo mật hệ thống.', 1, CAST(N'2026-05-23T10:14:43.427' AS DateTime), N'Node.js, ExpressJS, SQL Server, REST API, JWT, Git, Docker', N'Junior', N'Không yêu cầu', NULL, N'- Tối thiểu 3 năm kinh nghiệm Node.js.
- Thành thạo ExpressJS và SQL Server.
- Có kinh nghiệm thiết kế RESTful API.
- Hiểu về Authentication, Authorization, JWT.
- Biết sử dụng Docker là một lợi thế.
- Có khả năng làm việc nhóm và giải quyết vấn đề tốt.', NULL, 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (17, 8, N'Frontend Developer (ReactJS)', N'15 - 25 triệu', N'Full-time', N'1-2 năm', N'Hà Nội, Việt Nam', N'Thành thạo ReactJS, Tailwind CSS và JavaScript.
Có kinh nghiệm làm việc với RESTful API.
Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh.
Chủ động, có tinh thần trách nhiệm trong công việc.', 0, CAST(N'2026-05-25T17:06:16.303' AS DateTime), N'ReactJS, Tailwind CSS, JavaScript, Redux, Git', N'Junior', N'Không yêu cầu', NULL, N'- Tốt nghiệp chuyên ngành Công nghệ thông tin hoặc tương đương.
- Có kinh nghiệm làm việc với ReactJS và Tailwind CSS.
- Có khả năng làm việc nhóm, đọc hiểu tài liệu tiếng Anh kỹ thuật tốt.
- Có tư duy tốt về UI/UX là một lợi thế.', NULL, 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (18, 8, N'Backend Developer (Node.js)', N'10 triệu', N'Full-time', N'1-2 năm', N'Hà Nội', N'Thiết kế và phát triển RESTful APIs cho hệ thống tuyển dụng VietJob.
Xây dựng, tối ưu hóa cơ sở dữ liệu (SQL Server) cho hệ thống tìm việc.
Xử lý xác thực người dùng (Authentication) bằng JWT và bảo mật API.
Viết tài liệu API và phối hợp chặt chẽ với team Frontend.', 1, CAST(N'2026-05-25T17:13:15.947' AS DateTime), N'Node.js, Express.js, SQL Server, JWT, Postman, Git, Microservices, System Architecture', N'Intern', N'Không yêu cầu', NULL, N'Thành thạo Node.js, Express.js.
Có kiến thức vững về SQL Server hoặc MongoDB.
Hiểu biết tốt về kiến trúc Microservices hoặc REST API.
Tư duy logic tốt, giải quyết vấn đề nhanh.', NULL, 0)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (19, 8, N'3D Artist', N'15 triệu', N'Full-time', N'2 năm', N'Hà Nội', N'Thiết kế, xây dựng mô hình 3D (Character, Environment, Props) dựa trên ý tưởng và concept ban đầu.
Thực hiện công đoạn UV Mapping, Texturing và Shading để hoàn thiện sản phẩm.
Phối hợp cùng team Game Dev/Design để tối ưu hóa asset đảm bảo hiệu năng khi hiển thị.
Tham gia vào quá trình render hoặc export asset phục vụ cho các dự án game/nội dung tương tác 3D.
Nghiên cứu và áp dụng các xu hướng thiết kế 3D mới để nâng cao chất lượng sản phẩm của VietJob.', 1, CAST(N'2026-06-01T11:42:57.397' AS DateTime), N'Blender, Zbrush, Maya', N'Junior', N'Không yêu cầu', NULL, N'Có kinh nghiệm tối thiểu 1-2 năm ở vị trí 3D Artist hoặc Designer.
Portfolio ấn tượng, thể hiện rõ tư duy về bố cục, ánh sáng và khả năng xử lý model.
Thành thạo các phần mềm: Blender, ZBrush, Maya (Ưu tiên ứng viên có kiến thức về pipeline làm game hoặc phim).
Có khả năng tối ưu hóa lưới (topology) cho các sản phẩm 3D.
Tư duy sáng tạo, chủ động trong công việc và có tinh thần học hỏi các công cụ mới.', NULL, 1)
INSERT [dbo].[Jobs] ([JobID], [CompanyID], [JobTitle], [SalaryRange], [JobType], [Experience], [Location], [Description], [IsActive], [CreatedAt], [Skills], [JobLevel], [Gender], [ApplicationDeadline], [Requirements], [Benefits], [IsHighlighted]) VALUES (20, 11, N'Intern UI design', N'8 triệu', N'Part-time', N'1 năm', N'TP.HCM', N'Hỗ trợ Team Design trong việc lên ý tưởng và thiết kế giao diện cho các dự án Web/App của công ty.
Chuyển đổi các Wireframe/Prototype từ ý tưởng thành giao diện chi tiết trên Figma.
Phối hợp chặt chẽ với đội ngũ Developer để đảm bảo giao diện được thực thi đúng thiết kế (Pixel Perfect).
Cập nhật, chỉnh sửa các thành phần giao diện (UI Components) dựa trên phản hồi của cấp trên.
Tham gia các buổi họp brainstorm để đóng góp ý tưởng cho trải nghiệm người dùng (UX).
Nghiên cứu các xu hướng thiết kế giao diện mới để cải thiện chất lượng sản phẩm.', 1, CAST(N'2026-06-01T14:57:17.240' AS DateTime), N'Figma, Photoshop', N'Intern', N'Không yêu cầu', NULL, N'Sinh viên năm cuối hoặc mới tốt nghiệp các chuyên ngành Thiết kế đồ họa, Mỹ thuật đa phương tiện hoặc các ngành liên quan.
Có tư duy thẩm mỹ tốt về bố cục, màu sắc và typography.
Sử dụng thành thạo bộ công cụ thiết kế: Figma, Photoshop, Illustrator.
Có Portfolio (Behance, Dribbble hoặc Website cá nhân) thể hiện được các dự án thiết kế UI/UX thực tế.
Có tinh thần cầu tiến, khả năng làm việc nhóm tốt và sẵn sàng học hỏi các quy trình thiết kế hiện đại.
Ưu tiên ứng viên có kiến thức cơ bản về quy tắc thiết kế giao diện trên nền tảng Mobile và Web.', NULL, 0)
SET IDENTITY_INSERT [dbo].[Jobs] OFF
GO
SET IDENTITY_INSERT [dbo].[khoa_hoc] ON 

INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (1, 10, N'Khoá học lập trình Unity', N'Nhiều cái ', N'Đang bán', CAST(N'2026-05-22T22:41:37.8466667' AS DateTime2), 10, NULL, NULL, 1, 10, CAST(N'2026-05-22T22:42:12.4266667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (2, 10, N'Khoá học Css', N'Ngon luôn', N'Đang bán', CAST(N'2026-05-22T22:43:02.2133333' AS DateTime2), 10, CAST(N'2026-05-22T22:43:20.6300000' AS DateTime2), 10, 1, 10, CAST(N'2026-06-01T10:28:47.9200000' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (3, 10, N'Làm chủ ReactJS và Tailwind CSS hiện đại', N'Khoá học cung cấp tư duy xây dựng giao diện chuẩn, tối ưu hoá component với ReactJS kết hợp styling chuyên sâu bằng Tailwind CSS.', N'Đang bán', CAST(N'2026-06-01T10:44:08.6766667' AS DateTime2), 10, NULL, NULL, 1, 10, CAST(N'2026-06-01T10:46:38.7300000' AS DateTime2), N'web', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 50, N'Mọi trình độ', N'Nguyễn Văn A', N'Đối tác Đào tạo VietJob', 1500000, 3000000, NULL)
INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (4, 10, N'Làm chủ ReactJS và Tailwind CSS hiện đại', N'Khoá học cung cấp tư duy xây dựng giao diện chuẩn, tối ưu hoá component với ReactJS kết hợp styling chuyên sâu bằng Tailwind CSS.', N'Đang bán', CAST(N'2026-06-01T10:46:55.8800000' AS DateTime2), 10, CAST(N'2026-06-01T10:47:13.8300000' AS DateTime2), NULL, 0, NULL, NULL, N'web', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 50, N'Mọi trình độ', N'Nguyen Van A', N'Đối tác Đào tạo VietJob', 1500000, 3000000, NULL)
INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (5, 10, N'Làm chủ Blender', N'UV, Modeling, texture...', N'Đang bán', CAST(N'2026-06-01T10:52:30.2733333' AS DateTime2), 10, CAST(N'2026-06-01T10:52:36.2866667' AS DateTime2), NULL, 0, NULL, NULL, N'design-gamedev', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 40, N'Mọi trình độ', N'Lương Đại Dương', N'Đối tác Đào tạo VietJob', 1500000, 4000000, NULL)
INSERT [dbo].[khoa_hoc] ([Id], [NhaTuyenDungId], [TieuDe], [MoTa], [TrangThai], [CreationTime], [CreatorUserId], [LastModificationTime], [LastModifierUserId], [IsDeleted], [DeleterUserId], [DeletionTime], [Category], [Rating], [ReviewsCount], [Duration], [LecturesCount], [Level], [InstructorName], [InstructorRole], [Price], [OldPrice], [DriveLink]) VALUES (6, 18, N'Lập trình C++', N'Lập trình UE5 dùng C++', N'Đang bán', CAST(N'2026-06-01T15:24:46.5933333' AS DateTime2), 18, CAST(N'2026-06-01T15:25:02.8400000' AS DateTime2), NULL, 0, NULL, NULL, N'design-gamedev', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 40, N'Cơ bản', N'Lương Đại Dương', N'Đối tác Đào tạo VietJob', 2000000, 3000000, N'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course')
SET IDENTITY_INSERT [dbo].[khoa_hoc] OFF
GO
SET IDENTITY_INSERT [dbo].[Messages] ON 

INSERT [dbo].[Messages] ([MessageID], [SenderID], [ReceiverID], [MessageContent], [CreatedAt], [IsRead], [AttachmentURL], [AttachmentName]) VALUES (1, 15, 10, N'Chào anh/chị, tôi rất quan tâm đến vị trí tuyển dụng và muốn trao đổi thêm.', CAST(N'2026-05-25T15:30:07.787' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[Messages] ([MessageID], [SenderID], [ReceiverID], [MessageContent], [CreatedAt], [IsRead], [AttachmentURL], [AttachmentName]) VALUES (2, 10, 15, N'ok', CAST(N'2026-05-25T15:30:33.950' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[Messages] ([MessageID], [SenderID], [ReceiverID], [MessageContent], [CreatedAt], [IsRead], [AttachmentURL], [AttachmentName]) VALUES (3, 15, 11, N'Chào công ty, tôi đã ứng tuyển và muốn gửi lời chào đến HR đại diện.', CAST(N'2026-05-25T15:31:05.343' AS DateTime), 0, NULL, NULL)
INSERT [dbo].[Messages] ([MessageID], [SenderID], [ReceiverID], [MessageContent], [CreatedAt], [IsRead], [AttachmentURL], [AttachmentName]) VALUES (4, 12, 10, N'dmm', CAST(N'2026-05-25T15:32:44.120' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[Messages] ([MessageID], [SenderID], [ReceiverID], [MessageContent], [CreatedAt], [IsRead], [AttachmentURL], [AttachmentName]) VALUES (5, 10, 12, N'???', CAST(N'2026-05-25T15:32:55.347' AS DateTime), 1, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Messages] OFF
GO
SET IDENTITY_INSERT [dbo].[Notifications] ON 

INSERT [dbo].[Notifications] ([NotificationID], [UserId], [Type], [Title], [Content], [IsRead], [CreatedAt], [RelatedID]) VALUES (1, 12, N'invite', N'Lời mời phỏng vấn từ Cty TNHH 1 Mjk Tao', N'Đơn ứng tuyển vị trí "Fondent" của bạn đã được Cty TNHH 1 Mjk Tao chấp nhận. Họ mời bạn tham gia phỏng vấn!', 1, CAST(N'2026-05-31T13:11:46.520' AS DateTime), 8)
INSERT [dbo].[Notifications] ([NotificationID], [UserId], [Type], [Title], [Content], [IsRead], [CreatedAt], [RelatedID]) VALUES (2, 19, N'invite', N'Lời mời phỏng vấn từ Công ty TNHH ABC', N'Đơn ứng tuyển vị trí "Intern UI design" của bạn đã được Công ty TNHH ABC chấp nhận. Họ mời bạn tham gia phỏng vấn!', 1, CAST(N'2026-06-02T12:20:33.707' AS DateTime), 9)
SET IDENTITY_INSERT [dbo].[Notifications] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (1, N'Admin')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (2, N'Candidate')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (3, N'Employer')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Skills] ON 

INSERT [dbo].[Skills] ([SkillID], [SkillName]) VALUES (2, N'Golang')
INSERT [dbo].[Skills] ([SkillID], [SkillName]) VALUES (4, N'Node.js')
INSERT [dbo].[Skills] ([SkillID], [SkillName]) VALUES (3, N'ReactJS')
INSERT [dbo].[Skills] ([SkillID], [SkillName]) VALUES (1, N'Ruby')
SET IDENTITY_INSERT [dbo].[Skills] OFF
GO
SET IDENTITY_INSERT [dbo].[Transactions] ON 

INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (1, 10, N'Thanh toán tin nổi bật VIP (Job ID: 19)', -1000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T14:30:52.773' AS DateTime), N'HDN7527209')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (2, 18, N'Nạp tiền vào ví qua Vietcombank QR', 10000000, N'Nap', N'ThanhCong', CAST(N'2026-06-01T15:04:56.913' AS DateTime), N'NAP3776383')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (3, 18, N'Thanh toán tin nổi bật VIP (Job ID: undefined)', -1000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:07:00.873' AS DateTime), N'HDN9273021')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (4, 18, N'Đăng ký gói VIP doanh nghiệp (Nổi bật Công ty & Tin tuyển dụng trên Trang chủ)', -3000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:14:29.283' AS DateTime), N'HDN9884150')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (5, 12, N'Thanh toán mua khóa học: Lập trình C++', -2000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:51:39.813' AS DateTime), N'CSH5839729')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (6, 18, N'Doanh thu bán khóa học: Lập trình C++ (85%) từ học viên Nguyễn Thị Hoài', 1700000, N'BanKhoaHoc', N'ThanhCong', CAST(N'2026-06-01T15:51:39.820' AS DateTime), N'CSR1020099')
INSERT [dbo].[Transactions] ([Id], [UserId], [Title], [Amount], [Type], [Status], [CreatedAt], [RefCode]) VALUES (7, 10, N'Nạp tiền vào ví qua Vietcombank QR', 2000000, N'Nap', N'ThanhCong', CAST(N'2026-06-03T12:28:17.447' AS DateTime), N'NAP9977301')
SET IDENTITY_INSERT [dbo].[Transactions] OFF
GO
SET IDENTITY_INSERT [dbo].[User_Courses] ON 

INSERT [dbo].[User_Courses] ([UserCourseID], [UserId], [CourseId], [Status], [CreatedAt], [LastModifiedAt]) VALUES (1, 12, N'2', N'Đang theo học', CAST(N'2026-06-01T10:17:12.190' AS DateTime), CAST(N'2026-06-01T10:17:12.190' AS DateTime))
INSERT [dbo].[User_Courses] ([UserCourseID], [UserId], [CourseId], [Status], [CreatedAt], [LastModifiedAt]) VALUES (3, 12, N'4', N'Đang theo học', CAST(N'2026-06-01T10:49:52.080' AS DateTime), CAST(N'2026-06-01T10:49:52.080' AS DateTime))
INSERT [dbo].[User_Courses] ([UserCourseID], [UserId], [CourseId], [Status], [CreatedAt], [LastModifiedAt]) VALUES (4, 12, N'5', N'Đang theo học', CAST(N'2026-06-01T10:52:52.253' AS DateTime), CAST(N'2026-06-01T15:16:26.213' AS DateTime))
INSERT [dbo].[User_Courses] ([UserCourseID], [UserId], [CourseId], [Status], [CreatedAt], [LastModifiedAt]) VALUES (5, 12, N'6', N'Đang theo học', CAST(N'2026-06-01T15:51:39.827' AS DateTime), CAST(N'2026-06-01T15:51:39.827' AS DateTime))
SET IDENTITY_INSERT [dbo].[User_Courses] OFF
GO
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (1, 1)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (10, 3)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (11, 3)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (12, 2)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (14, 2)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (15, 2)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (18, 3)
INSERT [dbo].[UserRoles] ([UserId], [RoleId]) VALUES (19, 2)
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (1, N'Duong', N'$2b$10$qN6WxoDvKUM6H2RcozvRZO/51VKyoPQX179gi1p1uY6GOffZFml3C', N'luongduongess@gmail.com', CAST(N'2026-04-20T21:53:18.533' AS DateTime), NULL, NULL, NULL, NULL, 5000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (10, N'Đỗ Phương Thảo', N'$2b$10$txKXiwN1l4GUtROrweqwBO0CaAX5kA7VIG8dJ5p7yfEso5gbVWzqO', N'thaodo9683@gmail.com', CAST(N'2026-05-21T15:13:40.453' AS DateTime), N'Approved', NULL, NULL, 8, 6000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (11, N'Lương Thanh Tùng', N'$2b$10$DXx7oq0rxmRCjWoxRf3FWuFJaDnohbOb3QkwNCcvFE3cNrYTJ5yry', N'luongtung26022004@gmail.com', CAST(N'2026-05-23T09:43:42.833' AS DateTime), N'Approved', NULL, NULL, 9, 5000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (12, N'Nguyễn Thị Hoài', N'$2b$10$/AJyXpCo5nZrm40gAjkKuuWOP6JGsMS.1XWs2FpQHABwUoY7zl6u.', N'nhoai2007@gmail.com', CAST(N'2026-05-23T09:57:03.030' AS DateTime), N'Pending', NULL, NULL, NULL, 3000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (14, N'Vũ Bá Thành', N'$2b$10$mfgKOIlia/5gfYLVayOzNOiwrVmA9XWuYjFKoSV8U0gkndgl1klL6', N'vubathanh2004@gmail.com', CAST(N'2026-05-23T10:49:11.623' AS DateTime), N'Pending', NULL, NULL, NULL, 5000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (15, N'Nguyễn Minh Thắng', N'$2b$10$0De1TYkM4by.ZV0z8ZNlEex31xI4aHFlu2vP6Z4bjN9HwVT5ToLFW', N'an26220004@gmail.com', CAST(N'2026-05-23T11:01:54.153' AS DateTime), N'Pending', N'0963329076', NULL, NULL, 5000000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (18, N'Vũ Xuân Thành', N'$2b$10$D/sCYMVf2ySiIlwMz1xI0Orxtn/dxli1uOZX6lT4t.zcRL6X7QHLy', N'vxt233@gmail.com', CAST(N'2026-06-01T14:50:39.783' AS DateTime), N'Approved', NULL, NULL, 11, 12700000)
INSERT [dbo].[Users] ([Id], [Username], [Password], [Email], [CreatedAt], [Status], [Phone], [Address], [CompanyID], [Balance]) VALUES (19, N'luong thanh tung', N'$2b$10$oPChFUMvoToGqKGsYKp7PeXItmQewon43h4WphPLF4w2WeCTk7X4m', N'tungluong262004@gmail.com', CAST(N'2026-06-02T12:09:05.217' AS DateTime), N'Pending', N'0961169306', NULL, NULL, 5000000)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Object:  Index [UQ__Candidat__1788CC4D1E755538]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[CandidateCv] ADD UNIQUE NONCLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B6160B653A9C8]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Skills__B63C6571969368B2]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[Skills] ADD UNIQUE NONCLUSTERED 
(
	[SkillName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Applications] ADD  DEFAULT (getdate()) FOR [AppliedAt]
GO
ALTER TABLE [dbo].[Applications] ADD  DEFAULT (N'Đang chờ duyệt') FOR [Status]
GO
ALTER TABLE [dbo].[CandidateCv] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CandidateFiles] ADD  DEFAULT (getdate()) FOR [UploadedAt]
GO
ALTER TABLE [dbo].[Companies] ADD  DEFAULT ((0)) FOR [IsHot]
GO
ALTER TABLE [dbo].[Companies] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CompanyReviews] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[JobReports] ADD  DEFAULT ('Pending') FOR [Status]
GO
ALTER TABLE [dbo].[JobReports] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Jobs] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Jobs] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Jobs] ADD  DEFAULT ((0)) FOR [IsHighlighted]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ('web') FOR [Category]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ((4.8)) FOR [Rating]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ((24)) FOR [ReviewsCount]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT (N'45 giờ') FOR [Duration]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ((50)) FOR [LecturesCount]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT (N'Mọi trình độ') FOR [Level]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT (N'Đỗ Phương Thảo') FOR [InstructorName]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT (N'Đối tác Đào tạo VietJob') FOR [InstructorRole]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ((1500000)) FOR [Price]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ((3000000)) FOR [OldPrice]
GO
ALTER TABLE [dbo].[khoa_hoc] ADD  DEFAULT ('https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course') FOR [DriveLink]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ('system') FOR [Type]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[PopularKeywords] ADD  DEFAULT ((0)) FOR [SearchCount]
GO
ALTER TABLE [dbo].[Transactions] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[User_Courses] ADD  DEFAULT (N'Đang quan tâm') FOR [Status]
GO
ALTER TABLE [dbo].[User_Courses] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[User_Courses] ADD  DEFAULT (getdate()) FOR [LastModifiedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('Pending') FOR [Status]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((5000000)) FOR [Balance]
GO
ALTER TABLE [dbo].[AbpUsers]  WITH CHECK ADD  CONSTRAINT [FK_AbpUsers_AbpUsers_CreatorUserId] FOREIGN KEY([CreatorUserId])
REFERENCES [dbo].[AbpUsers] ([Id])
GO
ALTER TABLE [dbo].[AbpUsers] CHECK CONSTRAINT [FK_AbpUsers_AbpUsers_CreatorUserId]
GO
ALTER TABLE [dbo].[AbpUsers]  WITH CHECK ADD  CONSTRAINT [FK_AbpUsers_AbpUsers_DeleterUserId] FOREIGN KEY([DeleterUserId])
REFERENCES [dbo].[AbpUsers] ([Id])
GO
ALTER TABLE [dbo].[AbpUsers] CHECK CONSTRAINT [FK_AbpUsers_AbpUsers_DeleterUserId]
GO
ALTER TABLE [dbo].[AbpUsers]  WITH CHECK ADD  CONSTRAINT [FK_AbpUsers_AbpUsers_LastModifierUserId] FOREIGN KEY([LastModifierUserId])
REFERENCES [dbo].[AbpUsers] ([Id])
GO
ALTER TABLE [dbo].[AbpUsers] CHECK CONSTRAINT [FK_AbpUsers_AbpUsers_LastModifierUserId]
GO
ALTER TABLE [dbo].[AppCandidates]  WITH CHECK ADD  CONSTRAINT [FK_AppCandidates_AbpUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AbpUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AppCandidates] CHECK CONSTRAINT [FK_AppCandidates_AbpUsers_UserId]
GO
ALTER TABLE [dbo].[Applications]  WITH CHECK ADD FOREIGN KEY([JobID])
REFERENCES [dbo].[Jobs] ([JobID])
GO
ALTER TABLE [dbo].[CandidateCv]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CvEducation]  WITH CHECK ADD FOREIGN KEY([CvId])
REFERENCES [dbo].[CandidateCv] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CvExperience]  WITH CHECK ADD FOREIGN KEY([CvId])
REFERENCES [dbo].[CandidateCv] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[JobReports]  WITH CHECK ADD FOREIGN KEY([JobID])
REFERENCES [dbo].[Jobs] ([JobID])
GO
ALTER TABLE [dbo].[JobReports]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Jobs]  WITH CHECK ADD FOREIGN KEY([CompanyID])
REFERENCES [dbo].[Companies] ([CompanyID])
GO
ALTER TABLE [dbo].[JobSkills]  WITH CHECK ADD FOREIGN KEY([JobID])
REFERENCES [dbo].[Jobs] ([JobID])
GO
ALTER TABLE [dbo].[JobSkills]  WITH CHECK ADD FOREIGN KEY([SkillID])
REFERENCES [dbo].[Skills] ([SkillID])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([ReceiverID])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([SenderID])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[User_Courses]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD  CONSTRAINT [FK_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
GO
ALTER TABLE [dbo].[UserRoles] CHECK CONSTRAINT [FK_Role]
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD  CONSTRAINT [FK_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[UserRoles] CHECK CONSTRAINT [FK_User]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([CompanyID])
REFERENCES [dbo].[Companies] ([CompanyID])
GO
ALTER TABLE [dbo].[CompanyReviews]  WITH CHECK ADD CHECK  (([Rating]>=(1) AND [Rating]<=(5)))
GO
