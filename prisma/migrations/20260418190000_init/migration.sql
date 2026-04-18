-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('student', 'faculty', 'staff', 'admin');

-- CreateEnum
CREATE TYPE "user_type_student" AS ENUM ('Undergraduate Student', 'Graduate Student (Master's)', 'Graduate Student (PhD)', 'Distance/Online Learner');

-- CreateEnum
CREATE TYPE "user_type_faculty" AS ENUM ('Professor', 'Lecturer', 'Researcher');

-- CreateEnum
CREATE TYPE "user_type_staff" AS ENUM ('Administrative Staff', 'Technical/Support Staff', 'Librarian');

-- CreateEnum
CREATE TYPE "user_type_admin" AS ENUM ('System Administrator');

-- CreateEnum
CREATE TYPE "approval_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('availability', 'reminder', 'system');

-- CreateEnum
CREATE TYPE "journal_type" AS ENUM ('Journal', 'Reference');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL,
    "user_type_student" "user_type_student",
    "user_type_faculty" "user_type_faculty",
    "user_type_staff" "user_type_staff",
    "user_type_admin" "user_type_admin",
    "course" VARCHAR(100),
    "year_level" VARCHAR(20),
    "department" VARCHAR(100),
    "approval_status" "approval_status" NOT NULL DEFAULT 'pending',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "account_requests" (
    "request_id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "requested_role" "user_role" NOT NULL,
    "user_type" VARCHAR(50) NOT NULL,
    "course" VARCHAR(100),
    "department" VARCHAR(100),
    "year_level" VARCHAR(20),
    "id_document_path" VARCHAR(255),
    "status" "approval_status" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,

    CONSTRAINT "account_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "books" (
    "book_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(150) NOT NULL,
    "genre" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "pages" INTEGER,
    "publication_year" INTEGER,
    "stock_quantity" INTEGER NOT NULL DEFAULT 1,
    "available_copies" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Available',
    "location" VARCHAR(100),
    "color_theme" VARCHAR(30),
    "borrow_count" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "date_added" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "book_courses" (
    "book_id" INTEGER NOT NULL,
    "course_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "book_courses_pkey" PRIMARY KEY ("book_id","course_name")
);

-- CreateTable
CREATE TABLE "journals" (
    "journal_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "publisher" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(50) NOT NULL,
    "impact_factor" DECIMAL(4,2),
    "access_url" VARCHAR(500),
    "journal_type" "journal_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("journal_id")
);

-- CreateTable
CREATE TABLE "reading_lists" (
    "reading_list_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "faculty_id" UUID,
    "description" TEXT,
    "student_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_lists_pkey" PRIMARY KEY ("reading_list_id")
);

-- CreateTable
CREATE TABLE "reading_list_books" (
    "reading_list_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_list_books_pkey" PRIMARY KEY ("reading_list_id","book_id")
);

-- CreateTable
CREATE TABLE "borrow_records" (
    "borrow_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "book_id" INTEGER NOT NULL,
    "borrowed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "returned_date" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "borrow_records_pkey" PRIMARY KEY ("borrow_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" "notification_type" NOT NULL,
    "book_id" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "user_id" UUID,
    "user_name" VARCHAR(100) NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "wishlist_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "book_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("wishlist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "idx_users_approval_status" ON "users"("approval_status");

-- CreateIndex
CREATE INDEX "idx_users_course" ON "users"("course");

-- CreateIndex
CREATE INDEX "idx_users_department" ON "users"("department");

-- CreateIndex
CREATE INDEX "idx_users_is_active" ON "users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "account_requests_email_key" ON "account_requests"("email");

-- CreateIndex
CREATE INDEX "idx_account_requests_status" ON "account_requests"("status");

-- CreateIndex
CREATE INDEX "idx_account_requests_requested_at" ON "account_requests"("requested_at");

-- CreateIndex
CREATE INDEX "idx_books_title" ON "books"("title");

-- CreateIndex
CREATE INDEX "idx_books_author" ON "books"("author");

-- CreateIndex
CREATE INDEX "idx_books_genre" ON "books"("genre");

-- CreateIndex
CREATE INDEX "idx_books_status" ON "books"("status");

-- CreateIndex
CREATE INDEX "idx_books_featured" ON "books"("featured");

-- CreateIndex
CREATE INDEX "idx_books_date_added" ON "books"("date_added");

-- CreateIndex
CREATE INDEX "idx_book_courses_course_name" ON "book_courses"("course_name");

-- CreateIndex
CREATE INDEX "idx_journals_subject" ON "journals"("subject");

-- CreateIndex
CREATE INDEX "idx_journals_type" ON "journals"("journal_type");

-- CreateIndex
CREATE INDEX "idx_reading_lists_faculty_id" ON "reading_lists"("faculty_id");

-- CreateIndex
CREATE INDEX "idx_reading_lists_is_active" ON "reading_lists"("is_active");

-- CreateIndex
CREATE INDEX "idx_reading_list_books_book_id" ON "reading_list_books"("book_id");

-- CreateIndex
CREATE INDEX "idx_borrow_records_user_id" ON "borrow_records"("user_id");

-- CreateIndex
CREATE INDEX "idx_borrow_records_book_id" ON "borrow_records"("book_id");

-- CreateIndex
CREATE INDEX "idx_borrow_records_status" ON "borrow_records"("status");

-- CreateIndex
CREATE INDEX "idx_borrow_records_due_date" ON "borrow_records"("due_date");

-- CreateIndex
CREATE INDEX "idx_borrow_records_borrowed_date" ON "borrow_records"("borrowed_date");

-- CreateIndex
CREATE INDEX "idx_notifications_user_id" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_notifications_is_read" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "idx_notifications_type" ON "notifications"("notification_type");

-- CreateIndex
CREATE INDEX "idx_reviews_book_id" ON "reviews"("book_id");

-- CreateIndex
CREATE INDEX "idx_reviews_user_id" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "idx_reviews_rating" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "idx_unique_user_book_review" ON "reviews"("book_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_wishlist_items_user_id" ON "wishlist_items"("user_id");

-- CreateIndex
CREATE INDEX "idx_wishlist_items_book_id" ON "wishlist_items"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_user_id_book_id_key" ON "wishlist_items"("user_id", "book_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account_requests" ADD CONSTRAINT "account_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_courses" ADD CONSTRAINT "book_courses_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reading_lists" ADD CONSTRAINT "reading_lists_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reading_list_books" ADD CONSTRAINT "reading_list_books_reading_list_id_fkey" FOREIGN KEY ("reading_list_id") REFERENCES "reading_lists"("reading_list_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reading_list_books" ADD CONSTRAINT "reading_list_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddConstraint
ALTER TABLE "borrow_records" ADD CONSTRAINT "chk_borrow_records_dates" CHECK ("due_date" > "borrowed_date");

-- AddConstraint
ALTER TABLE "reviews" ADD CONSTRAINT "chk_reviews_rating" CHECK ("rating" >= 0 AND "rating" <= 5);
