using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookCart.Models
{
    public partial class Document
    {
        [Key]
        public int DocumentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Owner { get; set; }
        public string Category { get; set; }
        public string Content { get; set; }
        public string MineType { get; set; }
        public string CoverFileName { get; set; }
    }
}
