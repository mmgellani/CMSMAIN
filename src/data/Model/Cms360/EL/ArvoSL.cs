/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model.ArvoSL
{
    public class Content
    {
        public string ContentType { get; set; }
        public List<int> ContentIds { get; set; }
    }

    public class Value
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public int MaxWatched { get; set; }
        public int Remaining { get; set; }
        public int OrderNumber { get; set; }
        public List<Content> Content { get; set; }
        public bool IsArvo { get; set; }
        public bool? sloBased { get; set; }
    }

    public class Data
    {
        public List<Value> Value { get; set; }
        public List<string> Formatters { get; set; }
        public List<string> ContentTypes { get; set; }
        public object DeclaredType { get; set; }
        public int StatusCode { get; set; }
    }

    public class Message
    {
        public string Text { get; set; }
        public string Title { get; set; }
        public string MessageTypeId { get; set; }
    }

    public class ArvoSLResponse
    {
        public Data Data { get; set; }
        public Message Message { get; set; }
    }



}