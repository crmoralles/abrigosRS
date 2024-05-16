import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'
import { User, UserService } from 'src/app/core/services/repository/user.service'
import { UtilsService } from '../../core/services/utils.service'

const VALOR_SEM_CIDADE = ' Sem cidade informada'

/**
 * Componente responsável pelo gerenciamento do formulário de usuário.
 */
@Component({
  selector: 'app-users',
  styleUrls: ['./users.component.scss'],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  public userForm: FormGroup
  public submittedUsers: User[] = []
  public filterUsersList: User[] = []
  public message: string
  public sobrenome: string
  public messageType: string
  public submitted: boolean = false

  accessRoleOptions = []

  accessRoleOptionsAll = [
    {
      value: 10,
      label: 'Administrador',
      selected: false,
    },
    {
      value: 20,
      label: 'Suporte',
      selected: false,
    },
    {
      value: 30,
      label: 'Controlador',
      selected: false,
    },
    {
      value: 40,
      label: 'Voluntário',
      selected: false,
    },
  ]

  abrigosOptions = []
  abrigosOptionsFilter = []
  // abrigos: Abrigo[] = []
  citieOptions: {
    value: string
    label: string
    selected: boolean
  }[] = [
    {
      value: '- Todos -',
      label: '- Todos -',
      selected: true,
    },
    {
      value: VALOR_SEM_CIDADE,
      label: '- Sem cidade informada -',
      selected: false,
    },
  ]

  selectedUser: User = null
  modalShow: boolean = false
  titleModal: string = ''

  constructor(
    private fb: FormBuilder,
    private utilService: UtilsService,
    private userService: UserService,
    private abrigoServive: AbrigoService,
    public authorizationService: AuthorizationService
  ) {}

  addCityToFilter(city: string) {
    if (!city) return
    if (this.citieOptions.filter((c) => c.value === city).length === 0) {
      this.citieOptions = [...this.citieOptions, { value: city, label: city, selected: false }]
      this.citieOptions = this.citieOptions.sort((a, b) => {
        try {
          return a.label?.localeCompare(b.label)
        } catch (ex) {
          return 0
        }
      })
    }
  }

  ngOnInit() {
    this.initForm()

    //só permte cadastrar usuarios do mesmo nivel ou maior
    this.accessRoleOptions = this.accessRoleOptionsAll.filter(
      (o) => o.value >= this.authorizationService.currentUserRole
    )

    this.userService
      .load({ where: [{ key: 'role', condition: '>=', value: this.authorizationService.currentUserRole }] })
      .then((users) => {
        this.submittedUsers = users.map((u) => {
          u['abrigosNomes'] = u.abrigos?.reduce((p, c) => {
            return (p = p + ', ' + c.abrigoNome + '\n')
          }, '')
          u['abrigosNomes'] = u['abrigosNomes']?.substring(2)
          return u
        })
        this.filterUsersList = this.submittedUsers
      })

    this.abrigoServive.load().then((abrigos) => {
      abrigos.forEach((abrigo) => {
        if (Array.isArray(abrigo.nome)) abrigo.nome = abrigo.nome[0]

        this.addAbrigoToOptions(abrigo)
        this.addCityToFilter(abrigo.city)
        // this.abrigos = abrigos
      })
    })
  }

  initForm() {
    this.userForm = this.fb.group({
      role: [null, Validators.required],
      abrigos: [null],
      userId: [null],
      cpf: [null, Validators.required],
      name: [null, Validators.required],
      email: [null, Validators.required],
      mobile: [null, Validators.required],

      cep: [null],
      address: [null],
      number: [null],
      complement: [null],
      district: [null],
      city: [null],
      state: [null],
      filterAbrigos: [null],
      filterCityAbrigos: [null],
    })
  }

  addAbrigoToOptions(abrigo: Abrigo) {
    if (!abrigo) return
    if (this.abrigosOptions.filter((c) => c.value === abrigo.id).length === 0) {
      this.abrigosOptions = [
        ...this.abrigosOptions,
        { value: abrigo.id, label: abrigo.nome || abrigo.id, selected: false, city: abrigo.city },
      ]
      this.abrigosOptions = this.abrigosOptions.sort((a, b) => {
        try {
          return a.label?.localeCompare(b.label)
        } catch (ex) {
          return 0
        }
      })
      this.abrigosOptionsFilter = JSON.parse(JSON.stringify(this.abrigosOptions))
    }
  }

  validatorRequiredAbrigo() {
    const role = this.userForm.value.role
    return role > this.authorizationService.AUTHORIZATION_LEVEL_SUPORTE
  }

  /**
   * Manipula o envio do formulário.
   * Verifica se o formulário é válido, adiciona o usuário à lista de submissões, reseta o formulário e exibe a mensagem de sucesso.
   * Caso contrário, exibe a mensagem de formulário inválido.
   */
  async onSubmit() {
    //abrigos
    const abrigosSel = this.abrigosOptionsFilter
      .filter((abrigo) => abrigo.selected)
      .map((abrigo) => ({ abrigoId: abrigo.value, abrigoNome: abrigo.label }))

    //valida campos manualmente
    this.userForm.get('abrigos')?.markAsTouched()
    if (!this.validatorRequiredAbrigo() || (abrigosSel && abrigosSel.length)) {
      this.userForm.get('abrigos')?.updateValueAndValidity()
    } else {
      this.userForm.get('abrigos')?.setErrors({ required: true })
    }

    if (this.userForm.valid) {
      const user: User = {
        role: this.userForm.value.role,
        userId: null, //this.userForm.value.userId,
        cpf: this.userForm.value.cpf,
        name: this.userForm.value.name?.trim(),
        email: this.userForm.value.email?.trim(),
        mobile: this.userForm.value.mobile,

        cep: this.userForm.value.cep,
        address: this.userForm.value.address,
        addressNumber: this.userForm.value.number,
        addressComplement: this.userForm.value.complement,
        district: this.userForm.value.district,
        city: this.userForm.value.city,
        state: this.userForm.value.state,
      }

      user['abrigos'] = abrigosSel

      if (this.selectedUser) {
        user.id = this.selectedUser.id
        user.userId = this.selectedUser.userId
      } else {
        const userEqual = this.submittedUsers.filter((userFromList) => userFromList.email === user.email)
        if (userEqual && userEqual.length) {
          this.showFormSubmitted('Usuário já registrado com esse e-mail!', 'danger')
          return
        }
      }

      const userDb = await this.userService.addOrUpdate(user)
      const userIndex = this.submittedUsers.findIndex((userI) => userI.id === user.id)
      this.submittedUsers[userIndex] = userDb

      if (!this.selectedUser) this.submittedUsers.push(user)

      this.closeModal()
      this.resetForm()
      this.showFormSubmitted('Formulário enviado com sucesso!', 'success')
    } else {
      this.userForm.markAllAsTouched()
      this.showFormSubmitted('Formulário inválido!', 'danger')
    }
  }

  openEditModalData(user: User) {
    this.selectedUser = user

    this.abrigosOptions = this.abrigosOptions.map((abrigo) => {
      abrigo.selected = user.abrigos?.filter((abrigoUser) => abrigo.value === abrigoUser.abrigoId).length > 0
      return abrigo
    })
    this.accessRoleOptions = this.accessRoleOptions.map((role) => {
      role.selected = role.value === user.role
      return role
    })
    //const user: User = {
    this.userForm.get('role')?.setValue(user.role)
    this.userForm.get('userId')?.setValue(user.userId)
    this.userForm.get('userId')?.disable()
    this.userForm.get('cpf')?.setValue(user.cpf)
    this.userForm.get('name')?.setValue(user.name)
    this.userForm.get('email')?.setValue(user.email)
    this.userForm.get('mobile')?.setValue(user.mobile)
    this.userForm.get('cep')?.setValue(user.cep)
    this.userForm.get('address')?.setValue(user.address)
    this.userForm.get('number')?.setValue(user.addressNumber)
    this.userForm.get('complement')?.setValue(user.addressComplement)
    this.userForm.get('district')?.setValue(user.district)
    this.userForm.get('city')?.setValue(user.city)
    this.userForm.get('state')?.setValue(user.state)
    this.userForm.get('abrigoId')?.setValue(user.abrigoId)

    this.titleModal = 'Editar dados do usuário: ' + user.name
    this.modalShow = true
  }

  openModalAdd() {
    this.resetForm()
    this.userForm.get('userId')?.enable()
    this.titleModal = 'Cadastrar usuário: '
    this.modalShow = true
  }
  /**
   * Reseta os valores do formulário.
   */
  resetForm() {
    this.userForm.reset()

    this.userForm.get('cpf').reset()
    this.userForm.get('name').reset()
    this.userForm.get('email').reset()
    this.userForm.get('mobile').reset()
    this.userForm.get('userId').reset()

    this.abrigosOptions = this.abrigosOptions.map((abrigo) => {
      abrigo.selected = false
      return abrigo
    })
    this.accessRoleOptions = this.accessRoleOptions.map((role) => {
      role.selected = false
      return role
    })

    this.selectedUser = null
  }

  /**
   * Exibe a mensagem de formulário submetido.
   * @param message A mensagem a ser exibida.
   * @param type O tipo de mensagem.
   */
  showFormSubmitted(message: string, type: string) {
    this.submitted = true
    this.message = message
    this.messageType = type

    setTimeout(() => {
      this.submitted = false
    }, 10000)
  }

  /**
   * Remove um usuário da lista de submissões.
   * @param user usuário a ser removido.
   */
  removeUser(user: User) {
    this.submittedUsers = this.submittedUsers.filter((userList) => userList.userId !== user.userId)
    this.userService.deleteDoc(user.id)
  }

  /**
   * Manipula o evento de input de um campo.
   * Limpa o valor do campo se estiver vazio.
   * @param fieldName O nome do campo.
   */
  handleInput(fieldName: string) {
    const fieldControl = this.userForm.get(fieldName)

    if (fieldControl?.value?.toString()?.trim() === '') {
      fieldControl?.setValue('')
      fieldControl?.markAsUntouched()
      fieldControl?.markAsPristine()
      fieldControl?.updateValueAndValidity()
    }
  }

  handleBlur($event, fieldName: string) {}

  roleChange(event: any): void {
    const value = event.detail?.[0]?.value
    this.userForm.get('role')?.setValue(value)
  }

  abrigoChange(event: any): void {
    // const abrigoId = event.detail?.[0]?.value as Abrigo
    // if (!abrigoId) return
    // const abrigo = this.abrigos.filter((abrigo: Abrigo) => abrigo.id === abrigoId)[0]
    // this.userForm.get('abrigoId')?.setValue(abrigo.id)
    // this.userForm.get('abrigoNome')?.setValue(abrigo.nome)
  }

  async buscarEnderecoPorCep(cep: string) {
    const address = await this.utilService.buscarEnderecoPorCep(cep, false)
    this.userForm.get('address')?.setValue(address.endereco)
    this.userForm.get('district')?.setValue(address.bairro)
    this.userForm.get('city')?.setValue(address.cidade)
    this.userForm.get('state')?.setValue(address.uf)
  }

  closeModal() {
    this.modalShow = false
  }

  timeoutFilterAbrigos: any = null
  filterAbrigos() {
    if (this.timeoutFilterAbrigos) clearTimeout(this.timeoutFilterAbrigos)

    this.timeoutFilterAbrigos = setTimeout(() => {
      this.startFilter()
    }, 500)
  }

  filterCityChange(event: any): void {
    const city = event.detail?.[0]?.value

    this.userForm.get('filterCityAbrigos')?.setValue(city)
    this.startFilter()
  }

  startFilter() {
    let filterAbrigoValue = this.userForm.value.filterAbrigos ? this.userForm.value.filterAbrigos : null
    if (Array.isArray(filterAbrigoValue)) filterAbrigoValue = filterAbrigoValue[0]
    const filterCityValue = this.userForm.value.filterCityAbrigos ? this.userForm.value.filterCityAbrigos : null

    if (!filterCityValue || filterCityValue === '- Todos -')
      this.abrigosOptionsFilter = this.abrigosOptions.map((a) => a)
    else this.abrigosOptionsFilter = this.abrigosOptions.filter((abrigo) => abrigo.city === filterCityValue)

    if (!filterAbrigoValue || filterAbrigoValue === '')
      this.abrigosOptionsFilter = this.abrigosOptionsFilter.map((a) => a)
    else {
      this.abrigosOptionsFilter = this.abrigosOptionsFilter.filter(
        (abrigo) => abrigo.label?.toLowerCase().indexOf(filterAbrigoValue.toLowerCase()) >= 0
      )
    }
  }

  selectAbrigo(abrigo) {
    abrigo.selected = !abrigo.selected
  }

  filterUsersValue: string
  timeoutSearch: any
  filterUsers(event: Event) {
    const searchValue = event.target['value'][0]
    if (this.timeoutSearch) clearTimeout(this.timeoutSearch)

    this.timeoutSearch = setTimeout(() => {
      if (searchValue) {
        this.filterUsersList = this.submittedUsers.filter(
          (user) => user.email.indexOf(searchValue) >= 0 || user.name.indexOf(searchValue) >= 0
        )
      } else {
        this.filterUsersList = this.submittedUsers
      }
    }, 1000)
  }

  trackUsers(index: number, user: User) {
    return user.id
  }
}
