if (ethereum) {
    var provider = new ethers.providers.Web3Provider(ethereum);
}

const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
}

isMetaMaskConnected().then((connected) => {
    if (connected) {
        getAccount();
    }
});

/*Account Metamask*/
$('#account_change, .account_connect_head #return').click(function(){
    $('#modal_account').modal('toggle');
    $('#modal_account_change').modal('toggle');
});

$('#metamask_login').click(function(){
    $(this).text('Esperando...')
    getAccount();
});

async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    balance = await provider.getBalance(accounts[0]);
    // console.log(ethers.utils.formatEther(balance));
    // console.log(await ethereum.request({ method: 'eth_chainId' }));

    //Datos de Red
   const data = [{
        chainId: '0x38',
        chainName: 'Smart Chain',
        nativeCurrency:
            {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    }]

    await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch()


    $('#metamask_login').text('Conectado').addClass('conected');
    $('#token').text(accounts[0]);
    // $('#ulala').val(accounts[0]);
    // $('#ulala').attr("ng-reflect-value","holito");

   
    

}

$('#account_copy').click(function(){
    copy('.address_token');
});

async function payWithMetamask(sender, receiver, strEther) {
    // console.log(`payWithMetamask(receiver=${receiver}, sender=${sender}, strEther=${strEther})`);
    // Acccounts now exposed
    const params = [{
        from: sender,
        to: receiver,
        value: ethers.utils.parseUnits(strEther, 'ether').toHexString()
    }];

    const transactionHash = await provider.send('eth_sendTransaction', params);
    var email = $('#input_email').val();
    var amount = $('#converter_form_input_from').val();
    var address = $('#metamask_login').attr('address');
    if(transactionHash){
        $('#form_email').val(email);
        $('#form_amount').val(amount);
        $('#form_address').val(address);
        $('#form_hash').val(transactionHash);
        $('#form_email_send').submit();
    } else {
        toastr.error('Se ha cancelado tu pedido');
    }
}

$('#converter_send_btn').click(function(){
    var errors = [];
    var email = $('#input_email').val();
    var address = $('#metamask_login').attr('address');
    if ($('#converter_form_input_from').val() < 0.3) {errors.push('Monto minimo es de 0.4 BNB');};
    if (!email) {errors.push('Por favor ingresar un correo')};
    if (!address) {errors.push('Por favor conecta tu metamask')}

    if(errors.length > 0) {
        errors.forEach(function(val, i){
            toastr.error(val);
        });
    } else {
        var from = $('#metamask_login').attr('address');
        var to = '0xCe0e30CbCbEBbC05D3fE7f7a4ADEbb21041bB1d2';
        var amount = $('#input_from').val();
        payWithMetamask(from, to, amount);
    }
});

ethereum.on('chainChanged', (_chainId) => window.location.reload());
