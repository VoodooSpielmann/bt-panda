<?php
$a = '';
$b = '';
$username = '';
$password = '';

if(isset($_GET[$a]) && $_GET[$a] == $b){
    require_once 'config.core.php';
    require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
    require_once MODX_CORE_PATH . 'model/modx/modx.class.php';
    $modx = new modX();
    $modx->initialize('mgr');
    $modx->getService('error','error.modError');

    $output = $modx->runProcessor('security/login', array(
        'username' => $username,
        'password' => $password
    ));
    header('Location: '.$_SERVER['REQUEST_SCHEME'].'//'.$_SERVER["HTTP_HOST"].MODX_MANAGER_URL);
} else {
    exit();
}
