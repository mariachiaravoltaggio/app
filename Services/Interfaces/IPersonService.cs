using GestionaleCN.Dtos.PersonDTO;
using GestionaleCN.Models;

namespace GestionaleCN.Services.Interfaces;

public interface IPersonService
{
    public Task<List<PeopleDTO>> GetAll();
    public Task<PersonUpdateDTO> Get(int personId);
    public Task<int> Create(PersonCreateDTO person);
    public Task<int> Update(PersonUpdateDTO person);
    public Task Delete(int personId);




}
