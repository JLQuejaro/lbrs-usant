-- CreateEnum
CREATE TYPE "fine_status" AS ENUM ('unpaid', 'paid');

-- CreateTable
CREATE TABLE "fines" (
    "fine_id" SERIAL NOT NULL,
    "borrow_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "rate_per_day" DECIMAL(10,2) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "status" "fine_status" NOT NULL DEFAULT 'unpaid',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fines_pkey" PRIMARY KEY ("fine_id")
);

-- CreateIndex
CREATE INDEX "idx_fines_borrow_id" ON "fines"("borrow_id");

-- CreateIndex
CREATE INDEX "idx_fines_status" ON "fines"("status");

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "borrow_records"("borrow_id") ON DELETE CASCADE ON UPDATE NO ACTION;
