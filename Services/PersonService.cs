using GestionaleCN.Dtos.PersonDTO;
using GestionaleCN.Models;
using GestionaleCN.Services.Interfaces;

namespace GestionaleCN.Services
{
    public sealed class PersonService : IPersonService
    {
        public async Task<int> Create(PersonCreateDTO person)
        {
            throw new NotImplementedException();



        }

        public async Task Delete(int personId)
        {
            throw new NotImplementedException();
        }

        public async Task<PersonUpdateDTO> Get(int personId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<PeopleDTO>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<int> Update(PersonUpdateDTO person)
        {
            throw new NotImplementedException();
        }
    }
    
}
