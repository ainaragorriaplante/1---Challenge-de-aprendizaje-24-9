terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

variable "aws_region" {
  description = "Región de AWS donde desplegar el bucket S3"
  type        = string
  default     = "eu-west-1" # Puedes cambiarla por tu región preferida, ej: us-east-1
}

variable "bucket_prefix" {
  description = "Prefijo para el nombre del bucket S3"
  type        = string
  default     = "stayhub-hoteles"
}

provider "aws" {
  region = var.aws_region
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "hotel_site" {
  bucket        = "${var.bucket_prefix}-${random_id.bucket_suffix.hex}"
  force_destroy = true # Permite borrar el bucket con terraform destroy aunque tenga archivos
}

resource "aws_s3_bucket_website_configuration" "hotel_site_website" {
  bucket = aws_s3_bucket.hotel_site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "hotel_site_public" {
  bucket = aws_s3_bucket.hotel_site.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "hotel_site_policy" {
  bucket     = aws_s3_bucket.hotel_site.id
  depends_on = [aws_s3_bucket_public_access_block.hotel_site_public]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.hotel_site.arn}/*"
      }
    ]
  })
}

locals {
  files_to_upload = {
    "index.html"     = { path = "index.html", content_type = "text/html" }
    "css/styles.css" = { path = "css/styles.css", content_type = "text/css" }
    "js/app.js"      = { path = "js/app.js", content_type = "application/javascript" }
  }
}

resource "aws_s3_object" "site_assets" {
  for_each = local.files_to_upload

  bucket       = aws_s3_bucket.hotel_site.id
  key          = each.key
  source       = "${path.module}/${each.value.path}"
  content_type = each.value.content_type
  etag         = filemd5("${path.module}/${each.value.path}")
}

output "website_url" {
  description = "URL pública de la web de hoteles en S3"
  value       = "http://${aws_s3_bucket_website_configuration.hotel_site_website.website_endpoint}"
}

output "bucket_name" {
  description = "Nombre del bucket S3 creado"
  value       = aws_s3_bucket.hotel_site.id
}
