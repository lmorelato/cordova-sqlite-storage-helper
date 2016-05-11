var DeviceInfo = (function ()
{
    return {
        isMobile: function ()
        {
            return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
        }()
    }
})();
