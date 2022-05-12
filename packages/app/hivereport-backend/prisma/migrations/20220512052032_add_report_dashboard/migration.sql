-- CreateTable
CREATE TABLE "ReportDashboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,

    CONSTRAINT "ReportDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportDashboardItem" (
    "id" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "reportId" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,

    CONSTRAINT "ReportDashboardItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportDashboardItem" ADD CONSTRAINT "ReportDashboardItem_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "ReportDashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDashboardItem" ADD CONSTRAINT "ReportDashboardItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
