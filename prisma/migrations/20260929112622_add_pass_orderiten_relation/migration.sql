-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
