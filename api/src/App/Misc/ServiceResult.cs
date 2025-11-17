namespace App.Misc;

public class ServiceResult
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; }
    public object ResultData { get; set; }
}