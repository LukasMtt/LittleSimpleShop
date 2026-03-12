namespace Shop.Misc;

public class ServiceResult<T>
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public T? ResultData { get; set; }
}