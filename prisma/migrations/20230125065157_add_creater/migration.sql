-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "creater_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creater_id_fkey" FOREIGN KEY ("creater_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
